<script setup lang="ts">
import MicroPanel from './components/MicroPanel.vue'

// 🔹 Payload mock basé sur ton JSON /api/scenes (on ne garde que le 1er "bloc" PGM)
const MOCK_SCENES = [
  {
    "actions": [
      { "name": "PGM:auto", "state": null, "uuid": "7300e8ba-a18e-5019-9d26-fb3a98386045" },
      { "name": "PGM:cut", "state": null, "uuid": "c0ea50ff-02a6-5206-90a1-8d74c96e6437" },
      { "name": "BgdMix:show_layer", "state": null, "uuid": "6e3c08e3-7c77-504c-93f1-c9ae28acdda5" },
      { "name": "BgdMix:hide_layer", "state": null, "uuid": "b566b347-0331-5087-b804-a80b93c8b5e0" },
      { "name": "BgdMix:toggle_layer", "state": null, "uuid": "040753c9-ea01-5347-b884-21bb034d4e6c" },
      { "name": "GFX 1:show_layer", "state": null, "uuid": "52faf915-559a-58ec-8bc1-8c2e31570d47" },
      { "name": "GFX 1:hide_layer", "state": null, "uuid": "346a3fa1-d63f-57e3-90f9-af55d0aca118" },
      { "name": "GFX 1:toggle_layer", "state": null, "uuid": "f8c5c02f-6f29-535a-af2d-ed3339457279" },
      { "name": "BG FLOU:show_layer", "state": null, "uuid": "48f4e2e7-bb2a-57a3-9fac-2e0e2c76a29b" },
      { "name": "BG FLOU:hide_layer", "state": null, "uuid": "cb99fc38-dc85-5172-a280-684702cf846e" },
      { "name": "BG FLOU:toggle_layer", "state": null, "uuid": "bafbd756-413d-5d0f-9114-403247d5d151" },
      { "name": "TRAD GEST:show_layer", "state": null, "uuid": "fd3b7131-1e4c-526c-8a8b-a8c95c6f43df" },
      { "name": "TRAD GEST:hide_layer", "state": null, "uuid": "bed5af99-d4b5-5dfF4-982d-c64f39dbc48d" },
      { "name": "TRAD GEST:toggle_layer", "state": null, "uuid": "978bc256-6b44-51d0-8a64-52030f99f378" },
      { "name": "HABILLAGE:show_layer", "state": null, "uuid": "ef97ff2e-a269-5cb5-b67b-3b60df0aa652" },
      { "name": "HABILLAGE:hide_layer", "state": null, "uuid": "6d7ceddf-d8a4-5df6-90bc-e90d438a015a" },
      { "name": "HABILLAGE:toggle_layer", "state": null, "uuid": "921c28e3-1393-579a-ae18-3d522479deec" },
      { "name": "BgdMix:transition_cut", "state": null, "uuid": "bb0ec927-fac8-59f7-9c95-4852cc9913ce" },
      { "name": "BgdMix:transition_auto", "state": null, "uuid": "03b65561-5d42-5330-99ee-c803097c9157" },
      { "name": "L1:transition_cut", "state": null, "uuid": "28e26cbb-6bf2-5339-b4c6-cb48a21bb9c4" },
      { "name": "L1:transition_auto", "state": null, "uuid": "6518586f-27af-5d24-85ed-aba5c5e232fd" },
      { "name": "L2:transition_cut", "state": null, "uuid": "d73e39cd-b1fe-5d18-a682-f384ba2af69e" },
      { "name": "L2:transition_auto", "state": null, "uuid": "0b816cdf-3023-5920-8d72-300211e5f0d2" },
      { "name": "L3:transition_cut", "state": null, "uuid": "68feaf26-58c5-55a9-a7ff-cb25143ffc03" },
      { "name": "L3:transition_auto", "state": null, "uuid": "2097ae3f-4a00-57fd-886b-83f4105286a0" },
      { "name": "BU 1:recall", "state": null, "uuid": "8448f350-84e0-55aa-8bc9-e2f82e6e337a" }
    ],
    "layers": [
      {
        "name": "BgdMix",
        "path": "",
        "sourceA": "White",
        "sourceB": "ME4",
        "sources": ["CAM1","CAM2","CAM3","CAM4","CAM5","DIFF 1 EVS","ME1","ME3","ME4","IS1","ColorBar","Black","White","CP1","CP2","RAM1","RAM2","RAM3","RAM4","RAM5","RAM6","RAM7","RAM8"],
        "uuid": "1e4354ef-d4e2-5d10-9099-e7de35839805"
      },
      {
        "name": "GFX 1",
        "path": "",
        "sourceA": "GFX F",
        "sourceB": "CAM4",
        "sources": ["Black","ME1","ME3","CAM1","CAM2","CAM3","CAM4","CAM5","DIFF 1 EVS","CAM7","CAM8","CAM9","CAM10","CAM11","CAM12","CAM13","CAM14","CAM15","CAM16","VOIE 1","VOIE 2","VOIE 3","VOIE 4","CP1","CP2","RAM1","RAM2","RAM3","RAM4","RAM5","RAM6","RAM7","RAM8","IS1","IS2","IS3","IS4","IS5","IS6","IS7","IS8"],
        "uuid": "7ad92bc7-4259-5eed-933b-c6f2cd452a09"
      },
      {
        "name": "BG FLOU",
        "path": "",
        "sourceA": "ME4",
        "sourceB": "White",
        "sources": ["CAM1","CAM2","CAM3","CAM4","CAM5","DIFF 1 EVS","ME1","ME3","ME4","IS1","ColorBar","Black","White"],
        "uuid": "a364ec04-a2b5-576b-aa88-f6ffe0d0d366"
      },
      {
        "name": "TRAD GEST",
        "path": "",
        "sourceA": "CAM3",
        "sourceB": "CAM4",
        "sources": ["Black","White","White","ColA","ColB","ColC","FxIP1","FxIP2","FxIP3","FxIP4","FxIP2","FxRAM2","CAM1","CAM2","CAM3","CAM4","CAM5","DIFF 1 EVS","CAM7","CAM8","CAM9","CAM10","CAM11","CAM12","CAM13","CAM14","CAM15","CAM16","VOIE 1","VOIE 2","VOIE 3","VOIE 4"],
        "uuid": "b338f096-3e68-5581-b7d4-c0e04ceedc6d"
      },
      {
        "name": "HABILLAGE",
        "path": "",
        "sourceA": "CAM4",
        "sources": ["Black","ME1","ME3","CAM1","CAM2","CAM3","CAM4","CAM5","DIFF 1 EVS","CAM7","CAM8","CAM9","CAM10","CAM11","CAM12","CAM13","CAM14","CAM15","CAM16","VOIE 1","VOIE 2","VOIE 3","VOIE 4","CP1","CP2","RAM1","RAM2","RAM3","RAM4","RAM5","RAM6","RAM7","RAM8","IS1","IS2","IS3","IS4","IS5","IS6","IS7","IS8"],
        "uuid": "5eb2e325-e887-5d3f-8300-bd74075047d4"
      }
    ],
    "name": "PGM",
    "path": "",
    "snapshots": [
      {
        "name": "BU 1",
        "state": null,
        "uuid": "1871dbb0-9644-566e-bf02-f256126e1a68"
      }
    ],
    "tally": 1,
    "uuid": "af4414ff-52ba-5e5b-8764-51fae7592d14"
  }
]

function useMockScenes() {
  const bridge = (window as any).MicroPanelUI

  if (!bridge || typeof bridge.setScenes !== 'function') {
    console.warn('[App] MicroPanelUI bridge non disponible (composant pas encore monté ?)')
    return
  }

  bridge.setScenes(MOCK_SCENES, { updatedAt: Date.now() })

  if (typeof bridge.setSyncState === 'function') {
    bridge.setSyncState({
      isFetching: false,
      isInitialLoading: false,
      errorMessage: null,
      lastUpdated: Date.now(),
    })
  }
}
</script>

<template>
  <div class="app-shell">
    <header class="app-header">
      <button class="mock-button" type="button" @click="useMockScenes">
        Use mock scenes
      </button>
    </header>

    <MicroPanel />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #000;
}

.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  background: #151515;
  border-bottom: 1px solid #222;
}

.app-title {
  margin: 0;
  font-size: 16px;
  color: #e0e0e0;
}

.mock-button {
  padding: 6px 14px;
  border-radius: 999px;
  border: 1px solid #444;
  background: #222;
  color: #f5f5f5;
  font-size: 13px;
  cursor: pointer;
}

.mock-button:hover {
  background: #333;
}
</style>
