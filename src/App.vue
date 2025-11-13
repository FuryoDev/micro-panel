<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

type UnknownRecord = Record<string, unknown>

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
}

interface ScenesResponse {
  layers?: unknown
}

const API_URL = 'http://10.41.40.130:1234/scenes'
const POLL_INTERVAL = 3000

const layers = ref<SceneLayer[]>([])
const activeLayerIds = ref<Set<string>>(new Set())
const lastUpdated = ref<Date | null>(null)
const isInitialLoading = ref(true)
const isFetching = ref(false)
const errorMessage = ref<string | null>(null)

let pollTimer: ReturnType<typeof setInterval> | null = null

const delegationLayer = computed(() => layers.value[0] ?? null)

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

const visibleLayers = computed(() => {
  const delegationId = delegationLayer.value?.id
  const activeIds = activeLayerIds.value

  return layers.value.filter((layer) => {
    if (delegationId && layer.id === delegationId) return true
    return activeIds.has(layer.id)
  })
})

const hasVisibleLayers = computed(() => visibleLayers.value.length > 0)

const syncStatusText = computed(() => {
  if (errorMessage.value) return errorMessage.value
  if (isFetching.value && !lastUpdated.value) return 'Synchronisation en cours…'
  if (isFetching.value) return 'Mise à jour…'
  if (!lastUpdated.value) return 'En attente de données…'
  return `Synchronisé ${formatRelativeTime(lastUpdated.value)}`
})

const syncStatusClass = computed(() => {
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

async function loadScenes() {
  if (isFetching.value) return

  isFetching.value = true
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      mode: 'cors',
      credentials: 'include',
      cache: 'no-store',
      headers: {
        Accept: 'application/json, text/plain;q=0.9, */*;q=0.8',
      },
    })
    if (!response.ok) {
      throw new Error(`Erreur ${response.status}`)
    }

    const payload = await parseResponsePayload(response)
    const parsedLayers = parseLayers(payload)

    layers.value = parsedLayers
    lastUpdated.value = new Date()
    errorMessage.value = null
  } catch (error) {
    console.error('loadScenes', error)
    errorMessage.value = "Impossible de récupérer les scènes."
  } finally {
    isFetching.value = false
    isInitialLoading.value = false
  }
}

async function parseResponsePayload(response: Response): Promise<ScenesResponse | UnknownRecord | unknown> {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    try {
      return (await response.clone().json()) as ScenesResponse | UnknownRecord | unknown
    } catch (error) {
      console.warn('parseResponsePayload: JSON.parse failed, falling back to text mode', error)
    }
  }

  const text = await response.text()
  if (!text.trim()) {
    throw new Error('Réponse vide renvoyée par le serveur')
  }

  const sanitized = sanitizeJsonText(text)

  try {
    return JSON.parse(sanitized) as ScenesResponse | UnknownRecord | unknown
  } catch (error) {
    console.error('parseResponsePayload: unable to parse payload', error, { text })
    throw new Error('Réponse invalide reçue du serveur')
  }
}

function sanitizeJsonText(text: string): string {
  const trimmed = text.trim()

  if (!trimmed) return ''

  // Some controllers expose relaxed JSON (single quotes, trailing commas).
  // We try to fix the most common issues before handing it to JSON.parse.
  return trimmed
    .replace(/\r\n?/g, '\n')
    .replace(/([\{\[,]\s*)'([^'\n]*)'(?=\s*[:\}\],])/g, '$1"$2"')
    .replace(/:\s*'([^'\n]*)'/g, ': "$1"')
    .replace(/,\s*([}\]])/g, '$1')
}

function parseLayers(payload: unknown): SceneLayer[] {
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
    const id = typeof rawId === 'string' && rawId.trim().length > 0 ? rawId : `layer-${layerIndex}`

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
        ].find((value): value is string => typeof value === 'string' && value.trim().length > 0)
        const label = labelCandidate ?? buttonId

        const stateCandidate = [
          buttonRecord.state,
          buttonRecord.status,
          buttonRecord.mode,
          buttonRecord.value,
        ].find((value): value is string => typeof value === 'string' && value.trim().length > 0)

        const colorCandidate =
          typeof buttonRecord.color === 'string' && buttonRecord.color.trim().length > 0
            ? buttonRecord.color
            : undefined

        const targetLayerIdCandidate = [
          buttonRecord.targetLayerId,
          buttonRecord.target_layer_id,
          buttonRecord.layerId,
          buttonRecord.layer_id,
        ].find((value): value is string => typeof value === 'string' && value.trim().length > 0)

        const targetLayerNameCandidate = [
          buttonRecord.targetLayerName,
          buttonRecord.target_layer_name,
          buttonRecord.target,
          buttonRecord.layerName,
          buttonRecord.layer_name,
        ].find((value): value is string => typeof value === 'string' && value.trim().length > 0)

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

  return parsed
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

function handleButtonClick(layer: SceneLayer, button: SceneButton) {
  if (!delegationLayer.value || layer.id !== delegationLayer.value.id) return

  const targetId = resolveTargetLayerId(button)
  if (!targetId) return

  const next = new Set(activeLayerIds.value)
  if (next.has(targetId)) {
    next.delete(targetId)
  } else {
    next.add(targetId)
  }

  activeLayerIds.value = next
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
  void loadScenes()
}

onMounted(() => {
  void loadScenes()
  pollTimer = setInterval(() => {
    void loadScenes()
  }, POLL_INTERVAL)
})

onBeforeUnmount(() => {
  if (pollTimer) {
    clearInterval(pollTimer)
    pollTimer = null
  }
})
</script>

<template>
  <main class="panel-shell">
    <header class="panel-header">
      <div>
        <h1 class="panel-title">Scene Controller</h1>
        <p class="panel-subtitle">Interface de délégation et de pilotage des layers</p>
      </div>
      <div class="sync-indicator" :class="syncStatusClass">
        <span class="indicator-dot" aria-hidden="true" />
        <span class="indicator-text">{{ syncStatusText }}</span>
        <span v-if="formattedSyncTime" class="indicator-meta">{{ formattedSyncTime }}</span>
        <button
          class="ghost-button"
          type="button"
          @click="refreshNow"
          :disabled="isFetching"
        >
          Rafraîchir
        </button>
      </div>
    </header>

    <section v-if="!hasVisibleLayers && isInitialLoading" class="panel-placeholder">
      <p>Chargement des scènes…</p>
    </section>

    <section v-else-if="!hasVisibleLayers" class="panel-placeholder">
      <p>Aucune scène disponible.</p>
    </section>

    <section v-else class="panel-grid" :style="{ '--button-count': Math.max(columnCount, 1) }">
      <article
        v-for="layer in visibleLayers"
        :key="layer.id"
        class="panel-row"
        :class="{ 'is-delegation': layer.id === delegationLayer?.id }"
      >
        <div class="layer-title">{{ layer.name }}</div>
        <div class="layer-buttons">
          <button
            v-for="button in layer.buttons"
            :key="button.id"
            class="panel-button"
            :class="[
              `variant-${buttonVariant(button)}`,
              {
                'is-selected': layer.id === delegationLayer?.id && isDelegationButtonSelected(button),
                'is-linkable': layer.id === delegationLayer?.id && Boolean(delegationTargets.get(button.id)),
              },
            ]"
            type="button"
            :aria-pressed="layer.id === delegationLayer?.id ? isDelegationButtonSelected(button) : undefined"
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
