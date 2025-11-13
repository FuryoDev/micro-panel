<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

type KeyColor = 'grey' | 'lit-red' | 'lit-amber' | 'lit-green'
type BusGroup = 'program' | 'preview'

export type ToggleEventDetail = {
  id: string
  active: boolean
  color: KeyColor
}

export type BusEventDetail = {
  group: BusGroup
  id: string
}

export type FaderEventDetail = {
  value: number
}

interface MicroPanelEventMap {
  'toggle-change': ToggleEventDetail
  'bus-change': BusEventDetail
  'fader-change': FaderEventDetail
}

export interface MicroPanelState {
  toggles: Record<string, boolean>
  program: string | null
  preview: string | null
  fader: number
}

const emit = defineEmits<{
  <K extends keyof MicroPanelEventMap>(type: K, detail: MicroPanelEventMap[K]): void
}>()

const toggleState = reactive<Record<string, boolean>>({
  macro: false,
  bkgd: false,
  'key1-on': true,
  key1: true,
  'key2-on': true,
  key2: true,
  'key3-on': true,
  key3: false,
  'key4-on': true,
  key4: false,
  me1: false,
  me2: true,
  me3: false,
  me4: false,
  dip: false,
  dve: false,
  sting: false,
  mix: true,
  wipe: false,
  arm: false,
  shift: false,
  'prev-trans': false,
  cut: false,
  auto: true,
  'dsk1-tie': true,
  'dsk2-tie': true,
  'dsk1-cut': true,
  'dsk1-auto': false,
  'dsk2-cut': true,
  'dsk2-auto': false,
})

const toggleColors: Record<string, KeyColor> = {
  macro: 'grey',
  bkgd: 'grey',
  'key1-on': 'lit-red',
  key1: 'lit-amber',
  'key2-on': 'lit-red',
  key2: 'lit-amber',
  'key3-on': 'lit-red',
  key3: 'grey',
  'key4-on': 'lit-red',
  key4: 'grey',
  me1: 'grey',
  me2: 'lit-amber',
  me3: 'grey',
  me4: 'grey',
  dip: 'grey',
  dve: 'grey',
  sting: 'grey',
  mix: 'lit-amber',
  wipe: 'grey',
  arm: 'grey',
  shift: 'grey',
  'prev-trans': 'grey',
  cut: 'grey',
  auto: 'lit-red',
  'dsk1-tie': 'lit-amber',
  'dsk2-tie': 'lit-amber',
  'dsk1-cut': 'lit-red',
  'dsk1-auto': 'grey',
  'dsk2-cut': 'lit-red',
  'dsk2-auto': 'grey',
}

const programButtons = Array.from({ length: 10 }, (_, index) => index + 1)
const previewButtons = Array.from({ length: 10 }, (_, index) => index + 1)

const programSelection = ref<string>('program-4')
const previewSelection = ref<string>('preview-3')
const faderValue = ref(0.5)

const state = reactive<MicroPanelState>({
  toggles: toggleState,
  program: programSelection.value,
  preview: previewSelection.value,
  fader: faderValue.value,
})

const faderStepCount = 10

const litStepCount = computed(() => Math.round(faderValue.value * faderStepCount))
const faderSlot = ref<HTMLDivElement | null>(null)

function keyClasses(active: boolean, activeColor: KeyColor, options?: { size?: 'sm'; pill?: boolean }) {
  return [
    'key',
    options?.size === 'sm' ? 'sm' : '',
    options?.pill ? 'pill' : '',
    active ? activeColor : 'grey',
  ].filter(Boolean)
}

function onToggle(id: string) {
  if (!(id in toggleState)) return
  const color = toggleColors[id] ?? 'grey'
  const next = !toggleState[id]
  toggleState[id] = next
  emit('toggle-change', {
    id,
    active: next,
    color: next ? color : 'grey',
  })
}

function setToggle(id: string, active: boolean) {
  if (!(id in toggleState)) return
  toggleState[id] = active
}

function busClasses(group: BusGroup, id: string) {
  const isActive = group === 'program' ? programSelection.value === id : previewSelection.value === id
  const color = isActive ? (group === 'program' ? 'lit-red' : 'lit-green') : 'grey'
  return ['key', color]
}

function onBusClick(group: BusGroup, id: string) {
  if (group === 'program') {
    if (programSelection.value === id) return
    programSelection.value = id
    state.program = id
  } else {
    if (previewSelection.value === id) return
    previewSelection.value = id
    state.preview = id
  }

  emit('bus-change', { group, id })
}

function setBusSelection(group: BusGroup, id: string) {
  if (group === 'program') {
    if (programSelection.value === id) return
    programSelection.value = id
    state.program = id
  } else {
    if (previewSelection.value === id) return
    previewSelection.value = id
    state.preview = id
  }

  emit('bus-change', { group, id })
}

function setFader(value: number) {
  const clamped = Math.min(Math.max(value, 0), 1)
  const changed = clamped !== faderValue.value
  faderValue.value = clamped
  state.fader = clamped
  if (changed) {
    emit('fader-change', { value: clamped })
  }
}

function updateFaderFromPointer(clientY: number) {
  const slot = faderSlot.value
  if (!slot) return
  const rect = slot.getBoundingClientRect()
  const styles = getComputedStyle(slot)
  const padding = parseFloat(styles.getPropertyValue('--fader-padding')) || 0
  const minY = rect.top + padding
  const maxY = rect.bottom - padding
  const clampedY = Math.min(Math.max(clientY, minY), maxY)
  const ratio = (clampedY - minY) / (maxY - minY)
  const value = 1 - ratio
  setFader(value)
}

function onFaderPointerDown(event: PointerEvent) {
  const slot = faderSlot.value
  if (!slot) return
  slot.setPointerCapture(event.pointerId)
  updateFaderFromPointer(event.clientY)
}

function onFaderPointerMove(event: PointerEvent) {
  const slot = faderSlot.value
  if (!slot?.hasPointerCapture(event.pointerId)) return
  updateFaderFromPointer(event.clientY)
}

function onFaderPointerUp(event: PointerEvent) {
  const slot = faderSlot.value
  if (!slot?.hasPointerCapture(event.pointerId)) return
  slot.releasePointerCapture(event.pointerId)
}

defineExpose({
  state,
  setToggle,
  setBusSelection,
  setFader,
})
</script>

<template>
  <div class="panel">
    <div class="surface">
      <div class="board">
        <div class="panel-row panel-row--top">
          <div class="group group--column">
            <button
              type="button"
              :class="keyClasses(toggleState.macro, toggleColors.macro, { size: 'sm' })"
              :aria-pressed="toggleState.macro"
              @click="onToggle('macro')"
            >
              MACRO
            </button>
            <button
              type="button"
              :class="keyClasses(toggleState.bkgd, toggleColors.bkgd, { size: 'sm' })"
              :aria-pressed="toggleState.bkgd"
              @click="onToggle('bkgd')"
            >
              BKGD
            </button>
          </div>

          <div class="group group--keyers">
            <button
              v-for="id in ['key1-on', 'key2-on', 'key3-on', 'key4-on']"
              :key="id"
              type="button"
              :class="keyClasses(toggleState[id], toggleColors[id])"
              :aria-pressed="toggleState[id]"
              @click="onToggle(id)"
            >
              ON
            </button>
            <button
              v-for="id in ['key1', 'key2', 'key3', 'key4']"
              :key="id"
              type="button"
              :class="keyClasses(toggleState[id], toggleColors[id], { size: 'sm' })"
              :aria-pressed="toggleState[id]"
              @click="onToggle(id)"
            >
              {{ id.toUpperCase().replace('KEY', 'KEY ') }}
            </button>
          </div>

          <div class="group group--effects">
            <button
              v-for="id in ['me1', 'me2', 'me3', 'me4']"
              :key="id"
              type="button"
              :class="keyClasses(toggleState[id], toggleColors[id], { size: 'sm' })"
              :aria-pressed="toggleState[id]"
              @click="onToggle(id)"
            >
              {{ id.toUpperCase().replace('ME', 'M/E ') }}
            </button>
            <button
              v-for="id in ['dip', 'dve', 'sting']"
              :key="id"
              type="button"
              :class="keyClasses(toggleState[id], toggleColors[id], { size: 'sm' })"
              :aria-pressed="toggleState[id]"
              @click="onToggle(id)"
            >
              {{ id.toUpperCase() }}
            </button>
            <button
              v-for="id in ['mix', 'wipe', 'arm']"
              :key="id"
              type="button"
              :class="keyClasses(toggleState[id], toggleColors[id], { size: 'sm' })"
              :aria-pressed="toggleState[id]"
              @click="onToggle(id)"
            >
              {{ id.toUpperCase() }}
            </button>
          </div>

          <div class="group group--transition">
            <div class="stack">
              <button
                type="button"
                :class="keyClasses(toggleState.shift, toggleColors.shift, { size: 'sm' })"
                :aria-pressed="toggleState.shift"
                @click="onToggle('shift')"
              >
                SHIFT
              </button>
              <button
                type="button"
                :class="keyClasses(toggleState['prev-trans'], toggleColors['prev-trans'], { size: 'sm' })"
                :aria-pressed="toggleState['prev-trans']"
                @click="onToggle('prev-trans')"
              >
                PREV<br />TRANS
              </button>
            </div>
            <div class="stack">
              <button
                type="button"
                :class="keyClasses(toggleState.cut, toggleColors.cut, { size: 'sm' })"
                :aria-pressed="toggleState.cut"
                @click="onToggle('cut')"
              >
                CUT
              </button>
              <button
                type="button"
                :class="keyClasses(toggleState.auto, toggleColors.auto, { pill: true })"
                :aria-pressed="toggleState.auto"
                @click="onToggle('auto')"
              >
                AUTO
              </button>
            </div>
          </div>

          <div class="group group--fader">
            <div
              ref="faderSlot"
              class="fader-slot"
              role="slider"
              aria-label="Transition fader"
              aria-valuemin="0"
              aria-valuemax="1"
              :aria-valuenow="faderValue.toFixed(2)"
              :style="{ '--value': faderValue.toString() }"
              @pointerdown="onFaderPointerDown"
              @pointermove="onFaderPointerMove"
              @pointerup="onFaderPointerUp"
            >
              <div class="fader-meter">
                <div
                  v-for="index in faderStepCount"
                  :key="`meter-${index}`"
                  :class="['fader-step', { lit: index <= litStepCount }]"
                ></div>
              </div>
              <div class="fader-line"></div>
              <div class="fader-knob"></div>
            </div>
          </div>
        </div>

        <div class="panel-row panel-row--bus">
          <div class="group group--bus">
            <button
              v-for="number in programButtons"
              :key="`program-${number}`"
              type="button"
              :class="busClasses('program', `program-${number}`)"
              :aria-pressed="programSelection === `program-${number}`"
              @click="onBusClick('program', `program-${number}`)"
            >
              {{ number }}
            </button>
          </div>
        </div>

        <div class="panel-row panel-row--bus">
          <div class="group group--bus">
            <button
              v-for="number in previewButtons"
              :key="`preview-${number}`"
              type="button"
              :class="busClasses('preview', `preview-${number}`)"
              :aria-pressed="previewSelection === `preview-${number}`"
              @click="onBusClick('preview', `preview-${number}`)"
            >
              {{ number }}
            </button>
          </div>
        </div>
      </div>

      <div class="side">
        <div class="group group--column">
          <button
            type="button"
            :class="keyClasses(toggleState['dsk1-tie'], toggleColors['dsk1-tie'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk1-tie']"
            @click="onToggle('dsk1-tie')"
          >
            DSK 1<br />TIE
          </button>
          <button
            type="button"
            :class="keyClasses(toggleState['dsk2-tie'], toggleColors['dsk2-tie'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk2-tie']"
            @click="onToggle('dsk2-tie')"
          >
            DSK 2<br />TIE
          </button>
        </div>

        <div class="group group--column">
          <button
            type="button"
            :class="keyClasses(toggleState['dsk1-cut'], toggleColors['dsk1-cut'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk1-cut']"
            @click="onToggle('dsk1-cut')"
          >
            DSK 1<br />CUT
          </button>
          <button
            type="button"
            :class="keyClasses(toggleState['dsk1-auto'], toggleColors['dsk1-auto'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk1-auto']"
            @click="onToggle('dsk1-auto')"
          >
            DSK 1<br />AUTO
          </button>
        </div>

        <div class="group group--column">
          <button
            type="button"
            :class="keyClasses(toggleState['dsk2-cut'], toggleColors['dsk2-cut'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk2-cut']"
            @click="onToggle('dsk2-cut')"
          >
            DSK 2<br />CUT
          </button>
          <button
            type="button"
            :class="keyClasses(toggleState['dsk2-auto'], toggleColors['dsk2-auto'], { size: 'sm' })"
            :aria-pressed="toggleState['dsk2-auto']"
            @click="onToggle('dsk2-auto')"
          >
            DSK 2<br />AUTO
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:global(:root) {
  --panel-width: 1180px;
  --key-size: 52px;
  --panel-radius: 22px;
  --key-radius: 10px;
  --panel-padding: 32px;
  --inner-gap: 6px;
  --group-gap: 22px;
  --section-gap: 20px;
  --key-font-size: 12px;
}

@media (max-width: 1100px) {
  :global(:root) {
    --key-size: 46px;
    --panel-padding: 26px;
    --group-gap: 18px;
  }
}

@media (max-width: 900px) {
  :global(:root) {
    --key-size: 42px;
    --panel-padding: 22px;
    --group-gap: 16px;
  }
}

.panel {
  width: min(96vw, var(--panel-width));
  padding: var(--panel-padding);
  border-radius: var(--panel-radius);
  background:
    radial-gradient(160% 140% at 34% -12%, #1a1b1d 0 62%, #0c0c0d 100%),
    linear-gradient(#0a0b0c, #0a0b0c);
  box-shadow:
    inset 0 10px 20px rgba(255, 255, 255, 0.04),
    inset 0 -12px 22px rgba(0, 0, 0, 0.55),
    0 28px 50px rgba(0, 0, 0, 0.65);
  position: relative;
  color: #0f0f10;
}

.surface {
  margin-top: 18px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  column-gap: 36px;
  align-items: start;
}

.board {
  display: flex;
  flex-direction: column;
  row-gap: var(--section-gap);
}

.side {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--section-gap);
}

.panel-row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--group-gap);
  align-items: flex-start;
}

.group {
  display: grid;
  gap: var(--inner-gap);
}

.group--column {
  grid-auto-rows: var(--key-size);
}

.group--keyers {
  grid-template-columns: repeat(4, var(--key-size));
  grid-auto-rows: var(--key-size);
}

.group--effects {
  grid-template-columns: repeat(4, var(--key-size));
  grid-auto-rows: var(--key-size);
}

.group--effects button:nth-child(n + 5) {
  grid-column: span 1;
}

.group--transition {
  display: flex;
  align-items: flex-end;
  gap: var(--inner-gap);
}

.stack {
  display: grid;
  gap: var(--inner-gap);
}

.group--fader {
  display: flex;
  align-items: center;
}

.group--bus {
  display: flex;
  gap: var(--inner-gap);
  flex-wrap: wrap;
}

.key {
  all: unset;
  width: var(--key-size);
  height: var(--key-size);
  border-radius: var(--key-radius);
  display: grid;
  place-items: center;
  font-weight: 600;
  font-size: var(--key-font-size);
  text-align: center;
  line-height: 1.05;
  padding: 0 4px;
  user-select: none;
  cursor: pointer;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.24),
    inset 0 -4px 10px rgba(0, 0, 0, 0.55),
    0 5px 12px rgba(0, 0, 0, 0.35);
  transition: transform 40ms ease, filter 120ms ease;
}

.key:active {
  transform: translateY(1px);
  filter: brightness(0.98);
}

.key:focus-visible {
  outline: 2px solid #4fa3ff;
  outline-offset: 2px;
}

.key.sm {
  font-size: 11px;
}

.key.pill {
  border-radius: 9px;
  height: calc(var(--key-size) - 6px);
  margin: auto 0;
}

.key.grey {
  background: linear-gradient(#f1f1f1, #dfdfdf 58%, #cbcbcb);
  color: #121212;
}

.key.lit-red {
  background: radial-gradient(circle at 50% 35%, #ff7373, #ff3838 60%, #b41a1a);
  color: #251010;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.28);
  box-shadow:
    0 0 12px rgba(255, 70, 70, 0.35),
    inset 0 -6px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.26);
}

.key.lit-amber {
  background: radial-gradient(circle at 50% 35%, #ffd87f, #ffc443 62%, #b26f08);
  color: #332100;
  box-shadow:
    0 0 11px rgba(255, 200, 90, 0.4),
    inset 0 -6px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.26);
}

.key.lit-green {
  background: radial-gradient(circle at 50% 35%, #86ffa2, #41e46c 60%, #118139);
  color: #0f2a14;
  box-shadow:
    0 0 12px rgba(74, 232, 118, 0.4),
    inset 0 -6px 14px rgba(0, 0, 0, 0.5),
    inset 0 2px 0 rgba(255, 255, 255, 0.26);
}

.fader-slot {
  --value: 0.5;
  --fader-padding: 18px;
  width: 78px;
  height: 320px;
  border-radius: 14px;
  background: linear-gradient(#121213, #080809);
  box-shadow:
    inset 0 9px 20px rgba(0, 0, 0, 0.82),
    inset 0 -10px 22px rgba(0, 0, 0, 0.65);
  position: relative;
  touch-action: none;
}

.fader-line {
  position: absolute;
  inset: var(--fader-padding) auto var(--fader-padding) 50%;
  width: 3px;
  transform: translateX(-50%);
  border-radius: 2px;
  background: linear-gradient(#1b1c1d, #0c0c0d);
}

.fader-knob {
  position: absolute;
  left: 50%;
  top: calc(var(--fader-padding) + (1 - var(--value)) * (100% - (var(--fader-padding) * 2)));
  width: 38px;
  height: 76px;
  border-radius: 10px;
  background: linear-gradient(#2a2a2b, #0e0e0f);
  box-shadow:
    inset 0 9px 12px rgba(255, 255, 255, 0.06),
    inset 0 -12px 16px rgba(0, 0, 0, 0.72),
    0 10px 22px rgba(0, 0, 0, 0.6);
  transform: translate(-50%, -50%);
  cursor: grab;
  touch-action: none;
}

.fader-knob:active {
  cursor: grabbing;
}

.fader-meter {
  position: absolute;
  left: -24px;
  top: var(--fader-padding);
  bottom: var(--fader-padding);
  width: 16px;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
}

.fader-step {
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(90deg, rgba(22, 22, 24, 0.85), rgba(8, 8, 9, 0.9));
  box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.6);
  opacity: 0.28;
  transition: opacity 140ms ease, background 140ms ease, box-shadow 140ms ease;
}

.fader-step.lit {
  opacity: 0.95;
  background: linear-gradient(90deg, #5cf1ff, #00c1ff);
  box-shadow:
    0 0 6px rgba(92, 241, 255, 0.5),
    inset 0 0 4px rgba(0, 0, 0, 0.35);
}
</style>
