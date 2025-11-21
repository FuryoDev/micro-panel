interface PanelButtonEvent {
  layerId: string
  layerName: string
  buttonId: string
  buttonLabel: string
  nextState?: string
  rawButton?: Record<string, unknown>
  rawLayer?: Record<string, unknown>
}

interface PanelIntegrationBridge {
  setScenes: (payload: unknown, meta?: { updatedAt?: Date | string | number }) => void
  setSyncState: (state: Record<string, unknown>) => void
  setPatchState: (state: Record<string, unknown>) => void
  onRefreshRequest: (handler: (() => void) | null) => void
  onButtonTrigger: (handler: ((event: PanelButtonEvent) => void) | null) => void
}

type SourceButtonMeta = {
  kind: 'source'
  sceneId: string
  layerId: string
  sourceKey: 'sourceA' | 'sourceB'
  layerState: Record<string, unknown>
  value: string
}

type SnapshotButtonMeta = {
  kind: 'snapshot'
  sceneId: string
  uuid: string
}

type MacroButtonMeta = {
  kind: 'macro'
  sceneId: string
  uuid: string
}

type ButtonMeta = SourceButtonMeta | SnapshotButtonMeta | MacroButtonMeta
type MetaCandidate = {
  kind?: unknown
  sceneId?: unknown
  layerId?: unknown
  sourceKey?: unknown
  value?: unknown
  layerState?: unknown
  uuid?: unknown
}

const API_BASE_URL = 'http://10.41.40.130:1234'
const API_SCENES_ENDPOINT = `${API_BASE_URL}/scenes`
let isIntegrationSetup = false

export function setupPanelIntegration() {
  if (typeof window === 'undefined') return
  if (isIntegrationSetup) return
  isIntegrationSetup = true

  waitForBridge().then((bridge) => {
    const controller = new PanelController(bridge)
    controller.init()
  })
}

function waitForBridge(): Promise<PanelIntegrationBridge> {
  return new Promise((resolve) => {
    const tryResolve = () => {
      if (window.MicroPanelUI) {
        resolve(window.MicroPanelUI)
        return
      }
      requestAnimationFrame(tryResolve)
    }

    tryResolve()
  })
}

class PanelController {
  private isInitialLoad = true
  private readonly bridge: PanelIntegrationBridge

  constructor(bridge: PanelIntegrationBridge) {
    this.bridge = bridge
  }

  init() {
    this.bridge.onRefreshRequest(() => {
      void this.loadScenes()
    })

    this.bridge.onButtonTrigger((event) => {
      void this.handleButtonEvent(event)
    })

    void this.loadScenes()
  }

  private async loadScenes() {
    this.bridge.setSyncState({
      isFetching: true,
      isInitialLoading: this.isInitialLoad,
      errorMessage: null,
    })

    try {
      const response = await fetch(API_SCENES_ENDPOINT, { cache: 'no-cache' })
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      const payload = await response.json()
      this.bridge.setScenes(payload, { updatedAt: Date.now() })
      this.bridge.setSyncState({
        isFetching: false,
        isInitialLoading: false,
        errorMessage: null,
        lastUpdated: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de charger les scènes'
      this.bridge.setSyncState({
        isFetching: false,
        isInitialLoading: false,
        errorMessage: message,
      })
    } finally {
      this.isInitialLoad = false
    }
  }

  private async handleButtonEvent(event: PanelButtonEvent) {
    const meta = extractButtonMeta(event)
    if (!meta) return

    try {
      this.bridge.setPatchState({ isPatching: true, patchError: null })

      if (meta.kind === 'source') {
        const { sceneId, layerId, layerState, sourceKey, value } = meta
        const payload = { ...layerState, [sourceKey]: value }
        await patchJson(`${API_SCENES_ENDPOINT}/${sceneId}/${layerId}`, payload)
      } else if (meta.kind === 'snapshot') {
        await patchJson(`${API_SCENES_ENDPOINT}/${meta.sceneId}/snapshots/${meta.uuid}`, {
          state: 'recall',
        })
      } else if (meta.kind === 'macro') {
        await patchJson(`${API_SCENES_ENDPOINT}/${meta.sceneId}/macros/${meta.uuid}`, {
          state: 'play',
        })
      }

      this.bridge.setPatchState({
        isPatching: false,
        patchError: null,
        lastPushedAt: Date.now(),
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Action impossible'
      this.bridge.setPatchState({
        isPatching: false,
        patchError: message,
      })
    }
  }
}

function extractButtonMeta(event: PanelButtonEvent): ButtonMeta | undefined {
  const rawButton = event.rawButton as { meta?: unknown } | undefined
  const candidate = rawButton?.meta as MetaCandidate | undefined
  if (!candidate || typeof candidate !== 'object') return undefined

  switch (candidate.kind) {
    case 'source':
      if (
        typeof candidate.sceneId === 'string' &&
        typeof candidate.layerId === 'string' &&
        (candidate.sourceKey === 'sourceA' || candidate.sourceKey === 'sourceB') &&
        typeof candidate.value === 'string' &&
        candidate.layerState &&
        typeof candidate.layerState === 'object'
      ) {
        return candidate as SourceButtonMeta
      }
      break
    case 'snapshot':
    case 'macro':
      if (typeof candidate.sceneId === 'string' && typeof candidate.uuid === 'string') {
        return candidate as SnapshotButtonMeta | MacroButtonMeta
      }
      break
    default:
      break
  }

  return undefined
}

async function patchJson(url: string, body: unknown) {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body ?? {}),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }
}

declare global {
  interface Window {
    MicroPanelUI?: PanelIntegrationBridge
  }
}
