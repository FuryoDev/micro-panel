<script setup lang="ts">
import { computed, ref, watch } from 'vue'

type UnknownRecord = Record<string, unknown>
type DateInput = Date | string | number | null | undefined

type LayerKind = 'delegation' | 'source' | 'snapshots' | 'macros'
type ButtonVariant = 'muted' | 'active' | 'preview' | 'warning' | 'danger' | 'light'

const PAGE_SIZE = 31
const PAGE_LABELS = ['1st', '2nd', '3rd']

interface SceneButton {
  id: string
  label: string
  state?: string
  color?: string
  targetLayerId?: string
  targetLayerName?: string
  raw?: UnknownRecord
  meta?: UnknownRecord
  disabled?: boolean
}

interface SceneLayer {
  id: string
  name: string
  buttons: SceneButton[]
  raw?: UnknownRecord
  sticky?: boolean
  kind?: LayerKind
  sceneId?: string
  pages?: SceneButton[][]
  pageIndex?: number
  pageCount?: number
  hasPager?: boolean
  meta?: UnknownRecord
}

interface ParsedLayerDefinition {
  id: string
  name: string
  path: string
  sources: string[]
  state: { sourceA?: string | null; sourceB?: string | null }
  raw: UnknownRecord
  hasSourceA: boolean
  hasSourceB: boolean
}

interface ParsedScene {
  id: string
  name: string
  raw: UnknownRecord
  layers: ParsedLayerDefinition[]
  snapshots: SceneButton[]
  macros: SceneButton[]
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
const scenes = ref<ParsedScene[]>([])
const layers = ref<SceneLayer[]>([])
const selectedSceneId = ref<string | null>(null)
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
const pageIndexCache = new Map<string, number>()

const delegationLayer = computed(() => layers.value.find((layer) => layer.kind === 'delegation') ?? null)
const hasRefreshHandler = computed(() => Boolean(refreshHandler.value))
const columnCount = computed(() => PAGE_SIZE + 1)
const visibleLayers = computed(() => layers.value)
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

watch(selectedSceneId, (sceneId) => {
  layers.value = buildVisibleLayers(scenes.value, sceneId)
})

function applyScenesPayload(payload: unknown, meta?: { updatedAt?: DateInput }) {
  rawPayload.value = payload ?? null
  const parsed = parseScenesPayload(payload)
  scenes.value = parsed
  if (!selectedSceneId.value || !parsed.some((scene) => scene.id === selectedSceneId.value)) {
    selectedSceneId.value = parsed[0]?.id ?? null
  }
  layers.value = buildVisibleLayers(parsed, selectedSceneId.value)
  lastUpdated.value = coerceDate(meta?.updatedAt) ?? (parsed.length > 0 ? new Date() : lastUpdated.value)
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
  if (button.disabled) return

  if (layer.kind === 'delegation') {
    selectScene(button.id)
    notifyButtonEvent(layer, button, 'active')
    return
  }

  if (layer.kind === 'source') {
    activateSourceButton(layer, button)
    notifyButtonEvent(layer, button, 'active')
    return
  }

  if (layer.kind === 'snapshots' || layer.kind === 'macros') {
    notifyButtonEvent(layer, button, undefined)
  }
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
    rawButton: button,
    rawLayer: layer.raw,
  })
}

function selectScene(sceneId: string) {
  if (!sceneId || sceneId === selectedSceneId.value) return
  selectedSceneId.value = sceneId
}

function activateSourceButton(layer: SceneLayer, button: SceneButton) {
  if (!layer.pages || layer.pages.length === 0) return
  const meta = button.meta ?? layer.meta
  if (!meta || meta.kind !== 'source') return

  const value = typeof meta.value === 'string' && meta.value.trim().length > 0
      ? meta.value.trim()
      : typeof button.label === 'string'
          ? button.label.trim()
          : ''
  if (!value) return

  layer.pages.forEach((page) => {
    page.forEach((candidate) => {
      candidate.state = candidate.id === button.id ? 'active' : undefined
    })
  })

  const activeIndex = layer.pageIndex ?? 0
  if (layer.pages[activeIndex]) {
    layer.buttons = layer.pages[activeIndex]
  }

  const scene = scenes.value.find((candidate) => candidate.id === meta.sceneId)
  const parsedLayer = scene?.layers.find((entry) => entry.id === meta.layerId)
  if (parsedLayer) {
    if (meta.sourceKey === 'sourceA') {
      parsedLayer.state.sourceA = value
    } else if (meta.sourceKey === 'sourceB') {
      parsedLayer.state.sourceB = value
    }
  }

  if (meta.layerState && typeof meta.layerState === 'object') {
    meta.layerState[meta.sourceKey] = value
  }
}

function cycleLayerPage(layer: SceneLayer) {
  if (!layer.pages || layer.pages.length === 0) return
  const nextIndex = ((layer.pageIndex ?? 0) + 1) % layer.pages.length
  layer.pageIndex = nextIndex
  pageIndexCache.set(layer.id, nextIndex)
  layer.buttons = layer.pages[nextIndex]
}

function pagerLabel(layer: SceneLayer): string {
  const index = layer.pageIndex ?? 0
  return PAGE_LABELS[index] ?? `${index + 1}th`
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
  const details: string[] = []
  if (layer.kind === 'delegation') {
    details.push(`Scene ${button.label}`)
  } else if (layer.kind === 'source') {
    details.push(`${layer.name} → ${button.label}`)
  } else {
    details.push(button.label)
  }
  if (button.state) {
    details.push(`État : ${button.state}`)
  }
  return details.filter(Boolean).join('\n')
}

function refreshNow() {
  refreshHandler.value?.()
}

function parseScenesPayload(payload: unknown): ParsedScene[] {
  if (!Array.isArray(payload)) return []

  return (payload as unknown[])
      .map((rawScene, sceneIndex) => {
        if (!rawScene || typeof rawScene !== 'object') return null
        const sceneRecord = rawScene as UnknownRecord
        const rawId = sceneRecord.uuid ?? sceneRecord.id ?? `scene-${sceneIndex}`
        const id = typeof rawId === 'string' ? rawId : `scene-${sceneIndex}`
        const nameCandidate =
            typeof sceneRecord.name === 'string' && sceneRecord.name.trim().length > 0
                ? sceneRecord.name
                : id
        const name = nameCandidate

        const parsedLayers = parseSceneLayers(sceneRecord)
        const snapshots = parseSceneButtons(sceneRecord.snapshots, `${id}-snapshot`)
        const macros = parseSceneButtons(sceneRecord.macros, `${id}-macro`)

        return {
          id,
          name,
          raw: sceneRecord,
          layers: parsedLayers,
          snapshots,
          macros,
        }
      })
      .filter((scene): scene is ParsedScene => Boolean(scene))
}

function parseSceneLayers(sceneRecord: UnknownRecord): ParsedLayerDefinition[] {
  const rawLayers = Array.isArray(sceneRecord.layers) ? sceneRecord.layers : []

  return rawLayers
      .map((rawLayer, layerIndex) => {
        if (!rawLayer || typeof rawLayer !== 'object') return null
        const layerRecord = rawLayer as UnknownRecord
        const rawUuid = layerRecord.uuid ?? layerRecord.id ?? `layer-${layerIndex}`
        const id = typeof rawUuid === 'string' ? rawUuid : `layer-${layerIndex}`
        const path = typeof layerRecord.path === 'string' ? layerRecord.path : ''
        const nameCandidate = [layerRecord.name, layerRecord.label, layerRecord.title].find(
            (value): value is string => typeof value === 'string' && value.trim().length > 0,
        )
        const name = nameCandidate ?? id
        const sources = Array.isArray(layerRecord.sources)
            ? (layerRecord.sources as unknown[]).map((entry) =>
                typeof entry === 'string'
                    ? entry
                    : typeof entry === 'number'
                        ? `${entry}`
                        : '',
            )
            : []
        const hasSourceA = Object.prototype.hasOwnProperty.call(layerRecord, 'sourceA')
        const hasSourceB = Object.prototype.hasOwnProperty.call(layerRecord, 'sourceB')
        const state = {
          sourceA:
              typeof layerRecord.sourceA === 'string' && layerRecord.sourceA.trim().length > 0
                  ? (layerRecord.sourceA as string)
                  : null,
          sourceB:
              typeof layerRecord.sourceB === 'string' && layerRecord.sourceB.trim().length > 0
                  ? (layerRecord.sourceB as string)
                  : null,
        }

        return {
          id,
          name,
          path,
          sources,
          state,
          raw: layerRecord,
          hasSourceA,
          hasSourceB,
        }
      })
      .filter((layer): layer is ParsedLayerDefinition => Boolean(layer))
}

function parseSceneButtons(collection: unknown, fallbackPrefix: string): SceneButton[] {
  if (!Array.isArray(collection)) return []
  return (collection as UnknownRecord[])
      .map((entry, index) => {
        if (!entry || typeof entry !== 'object') return null
        const rawEntry = entry as UnknownRecord
        const rawId = rawEntry.uuid ?? rawEntry.id ?? `${fallbackPrefix}-${index}`
        const id = typeof rawId === 'string' ? rawId : `${fallbackPrefix}-${index}`
        const nameCandidate =
            rawEntry.name ?? rawEntry.label ?? rawEntry.title ?? rawEntry.text ?? id
        const label = typeof nameCandidate === 'string' ? nameCandidate : id
        const state =
            typeof rawEntry.state === 'string' && rawEntry.state.trim().length > 0
                ? (rawEntry.state as string)
                : undefined

        return {
          id,
          label,
          state,
          raw: rawEntry,
        }
      })
      .filter((button): button is SceneButton => Boolean(button))
}

function buildVisibleLayers(parsedScenes: ParsedScene[], sceneId: string | null): SceneLayer[] {
  if (parsedScenes.length === 0) return []
  const result: SceneLayer[] = []

  const activeScene = parsedScenes.find((scene) => scene.id === sceneId) ?? parsedScenes[0]

  result.push(buildDelegationLayer(parsedScenes, activeScene.id))

  activeScene.layers.forEach((layer) => {
    const layerState = {
      ...layer.raw,
      uuid: layer.raw.uuid ?? layer.id,
      sourceA: layer.state.sourceA ?? null,
      sourceB: layer.state.sourceB ?? null,
    }

    if (layer.hasSourceA || (!layer.hasSourceA && !layer.hasSourceB)) {
      result.push(buildSourceRow(activeScene, layer, 'sourceA', layerState))
    }
    if (layer.hasSourceB) {
      result.push(buildSourceRow(activeScene, layer, 'sourceB', layerState))
    }
  })

  result.push(buildSnapshotsLayer(activeScene))
  result.push(buildMacrosLayer(activeScene))

  return result
}

function buildDelegationLayer(parsedScenes: ParsedScene[], activeSceneId: string): SceneLayer {
  return {
    id: 'delegation',
    name: 'Delegation',
    kind: 'delegation',
    sticky: true,
    buttons: parsedScenes.map((scene) => ({
      id: scene.id,
      label: scene.name,
      state: scene.id === activeSceneId ? 'program' : undefined,
      raw: scene.raw,
    })),
    raw: { type: 'delegation' },
  }
}

function buildLayerLabel(layer: ParsedLayerDefinition): string {
  const parts = [layer.path, layer.name].filter((value) => typeof value === 'string' && value.trim().length > 0)
  const base = parts.join(' ').trim()
  return base.length > 0 ? base : layer.name
}

function buildSourceRow(
    scene: ParsedScene,
    layer: ParsedLayerDefinition,
    sourceKey: 'sourceA' | 'sourceB',
    layerState: UnknownRecord,
): SceneLayer {
  const baseLabel = buildLayerLabel(layer)
  const suffix = layer.hasSourceA && layer.hasSourceB
      ? sourceKey === 'sourceA'
          ? ' - A'
          : ' - B'
      : ''
  const rowId = `${scene.id}:${layer.id}:${sourceKey}`
  const selectedValue = layer.state[sourceKey] ?? null
  const pages = buildPagedButtons(
      rowId,
      scene.id,
      layer.id,
      sourceKey,
      layer.sources,
      selectedValue,
      layerState,
  )
  const cachedIndex = pageIndexCache.get(rowId) ?? 0
  const pageIndex = Math.min(cachedIndex, pages.length - 1)

  return {
    id: rowId,
    name: `${baseLabel}${suffix}`,
    kind: 'source',
    sceneId: scene.id,
    buttons: pages[pageIndex] ?? [],
    pages,
    pageIndex,
    pageCount: pages.length,
    hasPager: true,
    raw: layer.raw,
    meta: {
      kind: 'source',
      sceneId: scene.id,
      layerId: layer.id,
      sourceKey,
      layerState,
    },
  }
}

function buildPagedButtons(
    rowId: string,
    sceneId: string,
    layerId: string,
    sourceKey: 'sourceA' | 'sourceB',
    sources: string[],
    selectedValue: string | null,
    layerState: UnknownRecord,
): SceneButton[][] {
  const totalPages = Math.max(PAGE_LABELS.length, 1)
  const totalSlots = totalPages * PAGE_SIZE
  const entries = [...sources]
  while (entries.length < totalSlots) {
    entries.push('')
  }

  const pages: SceneButton[][] = []
  for (let pageIndex = 0; pageIndex < totalPages; pageIndex += 1) {
    const offset = pageIndex * PAGE_SIZE
    const subset = entries.slice(offset, offset + PAGE_SIZE)
    const pageButtons = subset.map((label, index) => {
      const normalizedLabel = typeof label === 'string' ? label.trim() : ''
      const value = normalizedLabel || ''
      return {
        id: `${rowId}-btn-${offset + index}`,
        label: value || '\u00a0',
        state: value && selectedValue && value === selectedValue ? 'active' : undefined,
        raw: { value },
        meta: {
          kind: 'source',
          sceneId,
          layerId,
          sourceKey,
          value,
          layerState,
        },
        disabled: !value,
      }
    })
    pages.push(pageButtons)
  }

  return pages
}

function buildSnapshotsLayer(scene: ParsedScene): SceneLayer {
  const buttons = padButtons(
      scene.snapshots.map((button) => ({
        ...button,
        meta: {
          kind: 'snapshot',
          sceneId: scene.id,
          uuid: button.id,
        },
      })),
      `${scene.id}-snapshot-placeholder`,
  )

  return {
    id: `snapshots-${scene.id}`,
    name: 'Snapshots',
    kind: 'snapshots',
    buttons,
    sticky: true,
    raw: { type: 'snapshots' },
  }
}

function buildMacrosLayer(scene: ParsedScene): SceneLayer {
  const buttons = padButtons(
      scene.macros.map((button) => ({
        ...button,
        meta: {
          kind: 'macro',
          sceneId: scene.id,
          uuid: button.id,
        },
      })),
      `${scene.id}-macro-placeholder`,
  )

  return {
    id: `macros-${scene.id}`,
    name: 'Macros',
    kind: 'macros',
    buttons,
    sticky: true,
    raw: { type: 'macros' },
  }
}

function padButtons(buttons: SceneButton[], prefix: string): SceneButton[] {
  const result = [...buttons]
  while (result.length < PAGE_SIZE) {
    result.push(createPlaceholderButton(`${prefix}-${result.length}`))
  }
  return result.slice(0, PAGE_SIZE)
}

function createPlaceholderButton(id: string): SceneButton {
  return {
    id,
    label: '\u00a0',
    disabled: true,
    raw: { kind: 'placeholder' },
  }
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
                  layer.kind === 'delegation'
                    ? button.state === 'program'
                    : layer.kind === 'source' && isButtonToggledOn(button),
              },
            ]"
              type="button"
              :disabled="button.disabled"
              :aria-pressed="
              layer.kind === 'delegation' || layer.kind === 'source'
                ? isButtonToggledOn(button)
                : undefined
            "
              :title="buttonTitle(layer, button)"
              @click="handleButtonClick(layer, button)"
          >
            <span class="button-label">{{ button.label }}</span>
          </button>

          <button
              v-if="layer.kind === 'source' && layer.hasPager"
              :key="`${layer.id}-pager`"
              class="panel-button pager-button variant-warning"
              type="button"
              :title="`Changer de page (${pagerLabel(layer)})`"
              @click="cycleLayerPage(layer)"
          >
            <span class="button-label">{{ pagerLabel(layer) }}</span>
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

.button-label {
  pointer-events: none;
}

.pager-button {
  font-weight: 600;
}

/* Variantes “façon switcher” */

.variant-muted {
  background: #262626;
  color: #a0a0a0;
}

.variant-active {
  background: #f0f0f0;
  color: #111;
}

.variant-preview {
  background: #d0d0d0;
  color: #111;
}

.variant-warning {
  background: #f1c40f;
  color: #111;
}

.variant-danger {
  background: #e74c3c;
  color: #fff;
}

.variant-light {
  background: #ffffff;
  color: #111;
}
</style>
