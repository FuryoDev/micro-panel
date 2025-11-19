<script setup lang="ts">
import { onMounted } from 'vue'

import MicroPanel from './components/MicroPanel.vue'
import { setupPanelIntegration } from './panelIntegration'

onMounted(() => {
  setupPanelIntegration()
})
</script>

<template>
  <div class="app-shell">
    <MicroPanel />
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  margin: 0;
  background: #000;
}
</style>
