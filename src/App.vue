<script setup lang="ts">
import MicroPanel, {
  type BusEventDetail,
  type FaderEventDetail,
  type ToggleEventDetail,
} from './components/MicroPanel.vue'

function handleToggleChange(detail: ToggleEventDetail) {
  console.info('toggle-change', detail)
}

function handleBusChange(detail: BusEventDetail) {
  console.info('bus-change', detail)
}

function handleFaderChange(detail: FaderEventDetail) {
  console.info('fader-change', detail)
}
</script>

<template>
  <MicroPanel
    @toggle-change="handleToggleChange"
    @bus-change="handleBusChange"
    @fader-change="handleFaderChange"
  />
</template>
