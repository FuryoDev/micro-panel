import './style.css'
import {
  MicroPanel,
  type BusEventDetail,
  type FaderEventDetail,
  type ToggleEventDetail,
} from './microPanel.ts'

const app = document.querySelector<HTMLDivElement>('#app')

if (!app) {
  throw new Error('Missing #app container')
}

const panel = new MicroPanel()

panel.addEventListener('toggle-change', (event) => {
  const detail = (event as CustomEvent<ToggleEventDetail>).detail
  console.info('toggle-change', detail)
})

panel.addEventListener('bus-change', (event) => {
  const detail = (event as CustomEvent<BusEventDetail>).detail
  console.info('bus-change', detail)
})

panel.addEventListener('fader-change', (event) => {
  const detail = (event as CustomEvent<FaderEventDetail>).detail
  console.info('fader-change', detail)
})

app.replaceChildren(panel.element)
