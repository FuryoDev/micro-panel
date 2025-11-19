<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type UnknownRecord = Record<string, unknown>
type DateInput = Date | string | number | null | undefined

type ButtonVariant = 'muted' | 'active' | 'preview' | 'warning' | 'danger' | 'light'

interface SceneButton {
  id: string
  label: string
  state?: string
  color?: string
  targetLayerId?: string
  targetLayerName?: string
  raw?: UnknownRecord
}

interface SceneLayer {
  id: string
  name: string
  buttons: SceneButton[]
  raw?: UnknownRecord
  sticky?: boolean
}

interface ScenesResponse {
  layers?: unknown
}

interface PanelButtonEvent {
  layerId: string
  layerName: string
  buttonId: string
  buttonLabel: string
  nextState?: string
  targetLayerId?: string
  rawButton?: UnknownRecord
  rawLayer?: UnknownRecord
}

interface SyncStatePayload {
  isFetching?: boolean
  isInitialLoading?: boolean
  errorMessage?: string | null
  lastUpdated?: DateInput
  statusText?: string | null
  statusClass?: 'is-ok' | 'is-busy' | 'is-error' | null
}

interface PatchStatePayload {
  isPatching?: boolean
  patchError?: string | null
  lastPushedAt?: DateInput
}

interface PanelIntegrationBridge {
  setScenes: (payload: unknown, meta?: { updatedAt?: DateInput }) => void
  setSyncState: (state: SyncStatePayload) => void
  setPatchState: (state: PatchStatePayload) => void
  onRefreshRequest: (handler: (() => void) | null) => void
  onButtonTrigger: (handler: ((event: PanelButtonEvent) => void) | null) => void
}

declare global {
  interface Window {
    MicroPanelUI?: PanelIntegrationBridge
  }
}

const rawPayload = ref<unknown | null>(null)
const layers = ref<SceneLayer[]>([])
const activeLayerIds = ref<Set<string>>(new Set())
const lastUpdated = ref<Date | null>(null)
const lastPushedAt = ref<Date | null>(null)
const isInitialLoading = ref(true)
const isFetching = ref(false)
const errorMessage = ref<string | null>(null)
const isPatching = ref(false)
const patchError = ref<string | null>(null)
const syncStatusOverrideText = ref<string | null>(null)
const syncStatusOverrideClass = ref<'is-ok' | 'is-busy' | 'is-error' | null>(null)
const refreshHandler = ref<(() => void) | null>(null)
const buttonEventHandler = ref<((event: PanelButtonEvent) => void) | null>(null)
const delegationLayer = computed(() => layers.value[0] ?? null)
const hasRefreshHandler = computed(() => Boolean(refreshHandler.value))

const layerById = computed(() => {
  const map = new Map<string, SceneLayer>()
  for (const layer of layers.value) {
    map.set(layer.id, layer)
  }
  return map
})

const layerByName = computed(() => {
  const map = new Map<string, SceneLayer>()
  for (const layer of layers.value) {
    map.set(normalizeKey(layer.name), layer)
  }
  return map
})

const columnCount = computed(() => {
  return layers.value.reduce((max, layer) => Math.max(max, layer.buttons.length), 1)
})

const delegationTargets = computed(() => {
  const map = new Map<string, string>()
  const layer = delegationLayer.value
  if (!layer) return map
  for (const button of layer.buttons) {
    const targetId = resolveTargetLayerId(button)
    if (targetId) {
      map.set(button.id, targetId)
    }
  }
  return map
})

const visibleLayers = computed(() => {
  const delegationId = delegationLayer.value?.id
  const activeIds = activeLayerIds.value

  return layers.value.filter((layer) => {
    if (delegationId && layer.id === delegationId) return true
    if (layer.sticky) return true
    return activeIds.has(layer.id)
  })
})

const hasVisibleLayers = computed(() => visibleLayers.value.length > 0)

const syncStatusText = computed(() => {
  if (syncStatusOverrideText.value) return syncStatusOverrideText.value
  if (errorMessage.value) return errorMessage.value
  if (isFetching.value && !lastUpdated.value) return 'Synchronisation en cours…'
  if (isFetching.value) return 'Mise à jour…'
  if (!lastUpdated.value) return 'En attente de données…'
  return `Synchronisé ${formatRelativeTime(lastUpdated.value)}`
})

const syncStatusClass = computed(() => {
  if (syncStatusOverrideClass.value) return syncStatusOverrideClass.value
  if (errorMessage.value) return 'is-error'
  if (isFetching.value) return 'is-busy'
  return 'is-ok'
})

const formattedSyncTime = computed(() => {
  if (!lastUpdated.value) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(lastUpdated.value)
})

const formattedPushTime = computed(() => {
  if (!lastPushedAt.value) return ''
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(lastPushedAt.value)
})

watch(delegationTargets, (targets) => {
  const allowed = new Set(targets.values())
  const next = new Set<string>()
  for (const id of activeLayerIds.value) {
    if (allowed.has(id)) {
      next.add(id)
    }
  }
  if (next.size !== activeLayerIds.value.size) {
    activeLayerIds.value = next
  }
})

function applyScenesPayload(payload: unknown, meta?: { updatedAt?: DateInput }) {
  rawPayload.value = payload ?? null
  layers.value = parseLayers(payload)
  syncActiveLayersFromDelegation()
  lastUpdated.value = coerceDate(meta?.updatedAt) ?? (layers.value.length > 0 ? new Date() : lastUpdated.value)
  isInitialLoading.value = false
  errorMessage.value = null
}

function coerceDate(value: DateInput): Date | null {
  if (value instanceof Date) return value
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value)
    if (!Number.isNaN(parsed.getTime())) {
      return parsed
    }
  }
  return null
}

function applySyncState(state: SyncStatePayload) {
  if ('isFetching' in state && typeof state.isFetching === 'boolean') {
    isFetching.value = state.isFetching
  }
  if ('isInitialLoading' in state && typeof state.isInitialLoading === 'boolean') {
    isInitialLoading.value = state.isInitialLoading
  }
  if ('errorMessage' in state) {
    errorMessage.value = state.errorMessage ?? null
  }
  if ('lastUpdated' in state) {
    lastUpdated.value = coerceDate(state.lastUpdated) ?? null
  }
  if ('statusText' in state) {
    syncStatusOverrideText.value = state.statusText ?? null
  }
  if ('statusClass' in state) {
    syncStatusOverrideClass.value = state.statusClass ?? null
  }
}

function applyPatchState(state: PatchStatePayload) {
  if ('isPatching' in state && typeof state.isPatching === 'boolean') {
    isPatching.value = state.isPatching
  }
  if ('patchError' in state) {
    patchError.value = state.patchError ?? null
  }
  if ('lastPushedAt' in state) {
    lastPushedAt.value = coerceDate(state.lastPushedAt)
  }
}

function handleButtonClick(layer: SceneLayer, button: SceneButton) {
  if (delegationLayer.value && layer.id === delegationLayer.value.id) {
    toggleDelegationTarget(button)
    return
  }

  toggleLayerButton(button, layer)
}

function notifyButtonEvent(layer: SceneLayer, button: SceneButton, nextState: string | undefined) {
  const handler = buttonEventHandler.value
  if (!handler) return

  handler({
    layerId: layer.id,
    layerName: layer.name,
    buttonId: button.id,
    buttonLabel: button.label,
    nextState,
    targetLayerId: resolveTargetLayerId(button),
    rawButton: button.raw,
    rawLayer: layer.raw,
  })
}

function toggleDelegationTarget(button: SceneButton) {
  const targetId = resolveTargetLayerId(button)
  if (!targetId) return

  const next = new Set(activeLayerIds.value)
  const isActive = next.has(targetId)

  if (isActive) {
    next.delete(targetId)
  } else {
    next.add(targetId)
  }

  activeLayerIds.value = next

  const nextState = isActive ? undefined : 'active'
  updateButtonState(delegationLayer.value, button, nextState)
  if (delegationLayer.value) {
    notifyButtonEvent(delegationLayer.value, button, nextState)
  }
}

function toggleLayerButton(button: SceneButton, layer: SceneLayer) {
  const nextState = button.state ? undefined : 'active'
  updateButtonState(layer, button, nextState)
  updateRawPayloadState(button.id, nextState ?? null)
  notifyButtonEvent(layer, button, nextState)
}

function updateButtonState(
    layer: SceneLayer | null,
    button: SceneButton,
    nextState: string | undefined,
) {
  if (!layer) return

  const updatedLayers = layers.value.map((candidate) => {
    if (candidate.id !== layer.id) return candidate

    return {
      ...candidate,
      buttons: candidate.buttons.map((btn) =>
          btn.id === button.id
              ? {
                ...btn,
                state: nextState,
              }
              : btn,
      ),
    }
  })

  layers.value = updatedLayers
}

function updateRawPayloadState(buttonId: string, nextState: string | null) {
  const payload = rawPayload.value
  if (!Array.isArray(payload)) return

  payload.forEach((item) => {
    if (!item || typeof item !== 'object') return
    const record = item as UnknownRecord

    const collections = [
      record.actions,
      record.snapshots,
      record.macros,
      (record as UnknownRecord).buttons,
    ]

    collections.forEach((collection) => {
      if (!Array.isArray(collection)) return

      collection.forEach((entry) => {
        if (!entry || typeof entry !== 'object') return
        const entryRecord = entry as UnknownRecord
        const rawId = entryRecord.uuid ?? entryRecord.id

        if (rawId === buttonId) {
          entryRecord.state = nextState
        }
      })
    })
  })
}

function syncActiveLayersFromDelegation() {
  const delegation = delegationLayer.value
  if (!delegation) return

  const next = new Set<string>()
  delegation.buttons.forEach((button) => {
    if (!isButtonToggledOn(button)) return
    const targetId = resolveTargetLayerId(button)
    if (targetId) {
      next.add(targetId)
    }
  })

  if (next.size > 0) {
    activeLayerIds.value = next
  } else {
    const firstTarget = delegation.buttons[0]
        ? resolveTargetLayerId(delegation.buttons[0])
        : undefined
    if (firstTarget) {
      activeLayerIds.value = new Set([firstTarget])
    }
  }
}

function normalizeKey(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
      .toString()
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
}

function resolveTargetLayerId(button: SceneButton): string | undefined {
  if (button.targetLayerId && layerById.value.has(button.targetLayerId)) {
    return button.targetLayerId
  }

  if (button.targetLayerName) {
    const layer = layerByName.value.get(normalizeKey(button.targetLayerName))
    if (layer && layer.id !== delegationLayer.value?.id) {
      return layer.id
    }
  }

  const layerFromLabel = layerByName.value.get(normalizeKey(button.label))
  if (layerFromLabel && layerFromLabel.id !== delegationLayer.value?.id) {
    return layerFromLabel.id
  }

  return undefined
}

function isDelegationButtonSelected(button: SceneButton): boolean {
  const targetId = delegationTargets.value.get(button.id)
  return targetId ? activeLayerIds.value.has(targetId) : false
}

function isButtonToggledOn(button: SceneButton): boolean {
  const normalized = normalizeKey(button.state)
  if (!normalized) return false
  return normalized !== 'off' && normalized !== 'inactive'
}

function buttonVariant(button: SceneButton): ButtonVariant {
  const normalized = normalizeKey(button.state ?? button.color)

  switch (normalized) {
    case 'active':
    case 'on':
    case 'program':
    case 'pgm':
    case 'selected':
    case 'enabled':
    case 'live':
      return 'active'
    case 'preview':
    case 'pvw':
    case 'armed':
    case 'ready':
    case 'standby':
    case 'white':
    case 'light':
      return 'preview'
    case 'warning':
    case 'attention':
    case 'pending':
    case 'yellow':
    case 'caution':
      return 'warning'
    case 'error':
    case 'danger':
    case 'fault':
    case 'critical':
    case 'red':
      return 'danger'
    case 'highlight':
    case 'focus':
    case 'bright':
      return 'light'
    default:
      return 'muted'
  }
}

function formatRelativeTime(date: Date): string {
  const diffSeconds = Math.max(0, Math.round((Date.now() - date.getTime()) / 1000))
  if (diffSeconds < 2) return "à l'instant"
  if (diffSeconds < 60) return `il y a ${diffSeconds} s`

  const diffMinutes = Math.floor(diffSeconds / 60)
  if (diffMinutes < 60) return `il y a ${diffMinutes} min`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `il y a ${diffHours} h`

  const diffDays = Math.floor(diffHours / 24)
  return `il y a ${diffDays} j`
}

function buttonTitle(layer: SceneLayer, button: SceneButton): string {
  const details: string[] = [button.label]
  if (button.state) details.push(`État : ${button.state}`)
  const targetId = resolveTargetLayerId(button)
  if (targetId) {
    const targetLayer = layerById.value.get(targetId)
    if (targetLayer) {
      details.push(`Affiche : ${targetLayer.name}`)
    }
  }
  return details.join('\n')
}

function refreshNow() {
  refreshHandler.value?.()
}

function parseLayers(payload: unknown): SceneLayer[] {
  const snapshotButtons: SceneButton[] = []
  const macroButtons: SceneButton[] = []

  if (Array.isArray(payload)) {
    const scenes = payload as UnknownRecord[]

    const looksLikeScenes = scenes.every(
        (item) => item && typeof item === 'object' && Array.isArray((item as UnknownRecord).actions),
    )

    if (looksLikeScenes) {
      const parsedScenes: SceneLayer[] = []
      const delegationButtons: SceneButton[] = []

      scenes.forEach((rawScene, sceneIndex) => {
        const sceneRecord = rawScene as UnknownRecord

        const rawId = sceneRecord.uuid ?? sceneRecord.id
        const id =
            typeof rawId === 'string' && rawId.trim().length > 0 ? rawId : `scene-${sceneIndex}`

        const nameCandidate =
            typeof sceneRecord.name === 'string' && sceneRecord.name.trim().length > 0
                ? sceneRecord.name
                : id
        const name = nameCandidate

        const tally = typeof sceneRecord.tally === 'number' ? (sceneRecord.tally as number) : 0

        const actionsSource = Array.isArray(sceneRecord.actions)
            ? (sceneRecord.actions as UnknownRecord[])
            : []

        const buttons: SceneButton[] = actionsSource
            .map((rawAction, actionIndex) => {
              if (!rawAction || typeof rawAction !== 'object') return null

              const actionRecord = rawAction as UnknownRecord

              const rawButtonId = actionRecord.uuid ?? actionRecord.id
              const buttonId =
                  typeof rawButtonId === 'string' && rawButtonId.trim().length > 0
                      ? rawButtonId
                      : `${id}-btn-${actionIndex}`

              const label =
                  typeof actionRecord.name === 'string' && actionRecord.name.trim().length > 0
                      ? (actionRecord.name as string)
                      : buttonId

              const state =
                  typeof actionRecord.state === 'string' && actionRecord.state.trim().length > 0
                      ? (actionRecord.state as string)
                      : undefined

              const button: SceneButton = {
                id: buttonId,
                label,
                state,
                raw: actionRecord,
              }

              return button
            })
            .filter((b): b is SceneButton => Boolean(b))

        parsedScenes.push({
          id,
          name,
          buttons,
          raw: sceneRecord,
        })

        delegationButtons.push({
          id,
          label: name,
          state: tally > 0 ? 'program' : undefined,
          targetLayerId: id,
          raw: sceneRecord,
        })

        const rawSnapshots = Array.isArray(sceneRecord.snapshots)
            ? (sceneRecord.snapshots as UnknownRecord[])
            : []
        rawSnapshots.forEach((snap, snapIndex) => {
          if (!snap || typeof snap !== 'object') return

          const snapRecord = snap as UnknownRecord
          const snapIdCandidate = snapRecord.uuid ?? snapRecord.id ?? `${id}-snapshot-${snapIndex}`
          const snapId =
              typeof snapIdCandidate === 'string' ? snapIdCandidate : `${id}-snapshot-${snapIndex}`
          const snapNameCandidate =
              snapRecord.name ?? snapRecord.label ?? snapRecord.title ?? snapId
          const snapLabel =
              typeof snapNameCandidate === 'string' ? snapNameCandidate : snapId

          snapshotButtons.push({
            id: snapId,
            label: snapLabel,
            state:
                typeof snapRecord.state === 'string' ? (snapRecord.state as string) : undefined,
            raw: snapRecord,
          })
        })

        const rawMacros = Array.isArray(sceneRecord.macros)
            ? (sceneRecord.macros as UnknownRecord[])
            : []
        rawMacros.forEach((macro, macroIndex) => {
          if (!macro || typeof macro !== 'object') return

          const macroRecord = macro as UnknownRecord
          const macroIdCandidate =
              macroRecord.uuid ?? macroRecord.id ?? `${id}-macro-${macroIndex}`
          const macroId =
              typeof macroIdCandidate === 'string' ? macroIdCandidate : `${id}-macro-${macroIndex}`
          const macroNameCandidate =
              macroRecord.name ?? macroRecord.label ?? macroRecord.title ?? macroId
          const macroLabel =
              typeof macroNameCandidate === 'string' ? macroNameCandidate : macroId

          macroButtons.push({
            id: macroId,
            label: macroLabel,
            state:
                typeof macroRecord.state === 'string' && macroRecord.state.trim().length > 0
                    ? (macroRecord.state as string)
                    : undefined,
            raw: macroRecord,
          })
        })
      })

      const result: SceneLayer[] = []

      if (delegationButtons.length > 0) {
        result.push({
          id: 'delegation',
          name: 'Delegation',
          buttons: delegationButtons,
          raw: { type: 'delegation' },
          sticky: true,
        })
      }

      result.push(...parsedScenes)

      if (snapshotButtons.length > 0) {
        result.push({
          id: 'snapshots',
          name: 'Snapshots',
          buttons: snapshotButtons,
          raw: { type: 'snapshots' },
          sticky: true,
        })
      }

      result.push({
        id: 'macros',
        name: 'Macros',
        buttons: macroButtons,
        raw: { type: 'macros' },
        sticky: true,
      })

      return result
    }
  }

  const maybeResponse = payload as ScenesResponse
  const rawLayers = Array.isArray(maybeResponse?.layers)
      ? maybeResponse.layers
      : Array.isArray(payload)
          ? (payload as unknown[])
          : []

  const parsed: SceneLayer[] = []

  rawLayers.forEach((rawLayer, layerIndex) => {
    if (!rawLayer || typeof rawLayer !== 'object') return

    const layerRecord = rawLayer as UnknownRecord
    const rawId = layerRecord.id
    const id =
        typeof rawId === 'string' && rawId.trim().length > 0 ? rawId : `layer-${layerIndex}`

    const nameCandidate = [layerRecord.name, layerRecord.label, layerRecord.title].find(
        (value): value is string => typeof value === 'string' && value.trim().length > 0,
    )
    const name = nameCandidate ?? id

    const buttonsSource = Array.isArray(layerRecord.buttons) ? layerRecord.buttons : []

    const buttons: SceneButton[] = buttonsSource
        .map((rawButton, buttonIndex) => {
          if (!rawButton || typeof rawButton !== 'object') return null

          const buttonRecord = rawButton as UnknownRecord
          const rawButtonId = buttonRecord.id
          const buttonId =
              typeof rawButtonId === 'string' && rawButtonId.trim().length > 0
                  ? rawButtonId
                  : `${id}-btn-${buttonIndex}`

          const labelCandidate = [
            buttonRecord.label,
            buttonRecord.text,
            buttonRecord.name,
            buttonRecord.title,
          ].find(
              (value): value is string => typeof value === 'string' && value.trim().length > 0,
          )
          const label = labelCandidate ?? buttonId

          const stateCandidate = [
            buttonRecord.state,
            buttonRecord.status,
            buttonRecord.mode,
            buttonRecord.value,
          ].find(
              (value): value is string => typeof value === 'string' && value.trim().length > 0,
          )

          const colorCandidate =
              typeof buttonRecord.color === 'string' && buttonRecord.color.trim().length > 0
                  ? buttonRecord.color
                  : undefined

          const targetLayerIdCandidate = [
            buttonRecord.targetLayerId,
            buttonRecord.target_layer_id,
            buttonRecord.layerId,
            buttonRecord.layer_id,
          ].find(
              (value): value is string => typeof value === 'string' && value.trim().length > 0,
          )

          const targetLayerNameCandidate = [
            buttonRecord.targetLayerName,
            buttonRecord.target_layer_name,
            buttonRecord.target,
            buttonRecord.layerName,
            buttonRecord.layer_name,
          ].find(
              (value): value is string => typeof value === 'string' && value.trim().length > 0,
          )

          const button: SceneButton = {
            id: buttonId,
            label,
            state: stateCandidate,
            color: colorCandidate,
            targetLayerId: targetLayerIdCandidate,
            targetLayerName: targetLayerNameCandidate,
            raw: buttonRecord,
          }

          return button
        })
        .filter((button): button is SceneButton => Boolean(button))

    parsed.push({
      id,
      name,
      buttons,
      raw: layerRecord,
    })
  })

  if (snapshotButtons.length > 0) {
    parsed.push({
      id: 'snapshots',
      name: 'Snapshots',
      buttons: snapshotButtons,
      raw: { type: 'snapshots' },
      sticky: true,
    })
  }

  if (macroButtons.length > 0 || !parsed.some((layer) => layer.id === 'macros')) {
    parsed.push({
      id: 'macros',
      name: 'Macros',
      buttons: macroButtons,
      raw: { type: 'macros' },
      sticky: true,
    })
  }

  return parsed
}

const bridge: PanelIntegrationBridge = {
  setScenes: (payload, meta) => {
    applyScenesPayload(payload, meta)
  },
  setSyncState: (state) => {
    applySyncState(state)
  },
  setPatchState: (state) => {
    applyPatchState(state)
  },
  onRefreshRequest: (handler) => {
    refreshHandler.value = handler ?? null
  },
  onButtonTrigger: (handler) => {
    buttonEventHandler.value = handler ?? null
  },
}

if (typeof window !== 'undefined') {
  window.MicroPanelUI = bridge
}
</script>

<template>
  <main class="panel-shell">
    <header class="panel-header">
      <div>
        <h1 class="panel-title">Kairos Scenes</h1>
        <p class="panel-subtitle">Délégation et pilotage des scènes</p>
      </div>

      <div class="sync-indicator" :class="syncStatusClass">
        <span class="indicator-dot" aria-hidden="true" />
        <span class="indicator-text">{{ syncStatusText }}</span>
        <span v-if="formattedSyncTime" class="indicator-meta">{{ formattedSyncTime }}</span>
        <button
            class="ghost-button"
            type="button"
            @click="refreshNow"
            :disabled="isFetching || !hasRefreshHandler"
        >
          Rafraîchir
        </button>
      </div>

      <div class="patch-indicator" :class="{ 'is-busy': isPatching, 'is-error': Boolean(patchError) }">
        <span v-if="isPatching">Envoi des modifications…</span>
        <span v-else-if="patchError">{{ patchError }}</span>
        <span v-else-if="lastPushedAt">État envoyé à {{ formattedPushTime }}</span>
        <span v-else>État prêt</span>
      </div>
    </header>

    <section v-if="!hasVisibleLayers && isInitialLoading" class="panel-placeholder">
      <p>Chargement des scènes…</p>
    </section>

    <section v-else-if="!hasVisibleLayers" class="panel-placeholder">
      <p>Aucune scène disponible.</p>
    </section>

    <section
        v-else
        class="panel-grid"
        :style="{ '--button-count': Math.max(columnCount, 1) }"
    >
      <article
          v-for="layer in visibleLayers"
          :key="layer.id"
          class="panel-row"
          :class="{
          'is-delegation': layer.id === delegationLayer?.id,
          'is-sticky': layer.sticky,
        }"
      >
        <div class="layer-title">
          {{ layer.id === 'delegation' ? 'Delegation' : layer.name }}
        </div>

        <div class="layer-buttons">
          <button
              v-for="button in layer.buttons"
              :key="button.id"
              class="panel-button"
              :class="[
              `variant-${buttonVariant(button)}`,
              {
                'is-selected':
                  layer.id === delegationLayer?.id
                    ? isDelegationButtonSelected(button)
                    : isButtonToggledOn(button),
                'is-linkable':
                  layer.id === delegationLayer?.id && Boolean(delegationTargets.get(button.id)),
              },
            ]"
              type="button"
              :aria-pressed="
              layer.id === delegationLayer?.id
                ? isDelegationButtonSelected(button)
                : isButtonToggledOn(button)
            "
              :title="buttonTitle(layer, button)"
              @click="handleButtonClick(layer, button)"
          >
            <span class="button-label">{{ button.label }}</span>
          </button>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.panel-shell {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background: #111;
  color: #e0e0e0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  min-height: 100vh;
  box-sizing: border-box;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 12px;
}

.panel-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.panel-subtitle {
  margin: 2px 0 0;
  font-size: 12px;
  color: #aaa;
}

.sync-indicator {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  background: #1f1f1f;
}

.sync-indicator .indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.sync-indicator.is-ok .indicator-dot {
  background: #3fb950;
}

.sync-indicator.is-busy .indicator-dot {
  background: #f1c40f;
}

.sync-indicator.is-error .indicator-dot {
  background: #e74c3c;
}

.sync-indicator .indicator-text {
  white-space: nowrap;
}

.sync-indicator .indicator-meta {
  color: #888;
}

.ghost-button {
  border: 1px solid #444;
  background: transparent;
  color: #ccc;
  border-radius: 999px;
  font-size: 11px;
  padding: 2px 10px;
  cursor: pointer;
}

.ghost-button:disabled {
  opacity: 0.5;
  cursor: default;
}

.patch-indicator {
  font-size: 11px;
  color: #bbb;
}

.patch-indicator.is-busy {
  color: #f1c40f;
}

.patch-indicator.is-error {
  color: #e74c3c;
}

.panel-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  font-size: 14px;
}

.panel-grid {
  margin-top: 8px;
  padding: 8px;
  background: #181818;
  border-radius: 4px;
  border: 1px solid #2a2a2a;
  overflow-x: auto;
  box-shadow: inset 0 0 0 1px #000;
}

.panel-row {
  display: grid;
  grid-template-columns: 140px repeat(var(--button-count), 44px);
  align-items: center;
  column-gap: 4px;
  row-gap: 4px;
  padding: 4px 0;
}

.panel-row + .panel-row {
  border-top: 1px solid #202020;
}

.panel-row.is-delegation {
  margin-bottom: 6px;
  border-bottom: 1px solid #303030;
}

.layer-title {
  margin-left: 12px;
  padding-right: 8px;
  font-size: 12px;
  font-weight: 500;
  color: #ccc;
  text-align: left;
}

.layer-buttons {
  display: contents;
}

.panel-button {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  border: 1px solid #2f2f2f;
  background: #262626;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.6);
  color: #d0d0d0;
  font-size: 9px;
  line-height: 1.1;
  padding: 2px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  white-space: normal;
}

.panel-button:hover {
  border-color: #555;
}

.panel-button.is-selected {
  box-shadow: 0 0 0 2px #f1c40f, inset 0 0 4px rgba(0, 0, 0, 0.8);
}

.panel-button.is-linkable::after {
  content: '';
  position: absolute;
}

.button-label {
  pointer-events: none;
}

</style>
