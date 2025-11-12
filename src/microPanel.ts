import './microPanel.css'

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

export class MicroPanel extends EventTarget {
  public readonly element: HTMLElement
  public readonly state: MicroPanelState

  private readonly faderSlot: HTMLElement
  private readonly faderSteps: HTMLElement[]

  constructor() {
    super()
    this.state = {
      toggles: {},
      program: null,
      preview: null,
      fader: 0.5,
    }

    this.element = this.createElement()
    this.faderSlot = this.element.querySelector<HTMLElement>('.fader-slot')!
    this.faderSteps = Array.from(
      this.element.querySelectorAll<HTMLElement>('.fader-step'),
    )

    this.initialize()
  }

  private createElement(): HTMLElement {
    const panel = document.createElement('div')
    panel.className = 'panel'

    const faderScale = Array.from({ length: 10 }, () => '<div class="fader-step"></div>').join('')

    panel.innerHTML = `
      <div class="surface">
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="macro" style="--col: 6 / span 1; --row: 1">MACRO</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="bkgd" style="--col: 6 / span 1; --row: 2">BKGD</button>

        <button type="button" class="key lit-red" data-toggle data-color="lit-red" data-key-id="key1-on" style="--col: 8 / span 1; --row: 1">ON</button>
        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="key1" style="--col: 8 / span 1; --row: 2">KEY 1</button>

        <button type="button" class="key lit-red" data-toggle data-color="lit-red" data-key-id="key2-on" style="--col: 9 / span 1; --row: 1">ON</button>
        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="key2" style="--col: 9 / span 1; --row: 2">KEY 2</button>

        <button type="button" class="key lit-red" data-toggle data-color="lit-red" data-key-id="key3-on" style="--col: 10 / span 1; --row: 1">ON</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="key3" style="--col: 10 / span 1; --row: 2">KEY 3</button>

        <button type="button" class="key lit-red" data-toggle data-color="lit-red" data-key-id="key4-on" style="--col: 11 / span 1; --row: 1">ON</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="key4" style="--col: 11 / span 1; --row: 2">KEY 4</button>

        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="me1" style="--col: 14 / span 1; --row: 1">M/E 1</button>
        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="me2" style="--col: 15 / span 1; --row: 1">M/E 2</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="me3" style="--col: 16 / span 1; --row: 1">M/E 3</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="me4" style="--col: 17 / span 1; --row: 1">M/E 4</button>

        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="dip" style="--col: 14 / span 1; --row: 2">DIP</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="dve" style="--col: 15 / span 1; --row: 2">DVE</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="sting" style="--col: 16 / span 1; --row: 2">STING</button>

        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="mix" style="--col: 14 / span 1; --row: 3">MIX</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="wipe" style="--col: 15 / span 1; --row: 3">WIPE</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="arm" style="--col: 16 / span 1; --row: 3">ARM</button>

        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="shift" style="--col: 12 / span 1; --row: 4">SHIFT</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="prev-trans" style="--col: 12 / span 1; --row: 6">PREV<br>TRANS</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="cut" style="--col: 14 / span 1; --row: 6">CUT</button>
        <button type="button" class="key lit-red pill" data-toggle data-color="lit-red" data-key-id="auto" style="--col: 15 / span 1; --row: 6">AUTO</button>

        <div class="fader-wrap" style="--col: 19 / span 4; --row: 2 / span 6">
          <div class="fader-slot" role="slider" aria-label="Transition fader" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0.5">
            <div class="fader-meter">
              ${faderScale}
            </div>
            <div class="fader-line"></div>
            <div class="fader-knob"></div>
          </div>
        </div>

        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="dsk1-tie" style="--col: 22 / span 1; --row: 2">DSK 1<br>TIE</button>
        <button type="button" class="key lit-amber sm" data-toggle data-color="lit-amber" data-key-id="dsk2-tie" style="--col: 24 / span 1; --row: 2">DSK 2<br>TIE</button>

        <button type="button" class="key lit-red sm" data-toggle data-color="lit-red" data-key-id="dsk1-cut" style="--col: 22 / span 1; --row: 4">DSK 1<br>CUT</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="dsk1-auto" style="--col: 22 / span 1; --row: 5">DSK 1<br>AUTO</button>

        <button type="button" class="key lit-red sm" data-toggle data-color="lit-red" data-key-id="dsk2-cut" style="--col: 24 / span 1; --row: 4">DSK 2<br>CUT</button>
        <button type="button" class="key grey sm" data-toggle data-color="grey" data-key-id="dsk2-auto" style="--col: 24 / span 1; --row: 5">DSK 2<br>AUTO</button>

        <button type="button" class="key grey" data-group="program" data-key-id="program-1" style="--col: 4 / span 1; --row: 3">1</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-2" style="--col: 5 / span 1; --row: 3">2</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-3" style="--col: 6 / span 1; --row: 3">3</button>
        <button type="button" class="key lit-red" data-group="program" data-key-id="program-4" style="--col: 7 / span 1; --row: 3">4</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-5" style="--col: 8 / span 1; --row: 3">5</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-6" style="--col: 9 / span 1; --row: 3">6</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-7" style="--col: 10 / span 1; --row: 3">7</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-8" style="--col: 11 / span 1; --row: 3">8</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-9" style="--col: 12 / span 1; --row: 3">9</button>
        <button type="button" class="key grey" data-group="program" data-key-id="program-10" style="--col: 13 / span 1; --row: 3">10</button>

        <button type="button" class="key grey" data-group="preview" data-key-id="preview-1" style="--col: 4 / span 1; --row: 5">1</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-2" style="--col: 5 / span 1; --row: 5">2</button>
        <button type="button" class="key lit-green" data-group="preview" data-key-id="preview-3" style="--col: 6 / span 1; --row: 5">3</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-4" style="--col: 7 / span 1; --row: 5">4</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-5" style="--col: 8 / span 1; --row: 5">5</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-6" style="--col: 9 / span 1; --row: 5">6</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-7" style="--col: 10 / span 1; --row: 5">7</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-8" style="--col: 11 / span 1; --row: 5">8</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-9" style="--col: 12 / span 1; --row: 5">9</button>
        <button type="button" class="key grey" data-group="preview" data-key-id="preview-10" style="--col: 13 / span 1; --row: 5">10</button>
      </div>
    `

    return panel
  }

  private initialize(): void {
    this.bindToggleKeys()
    this.bindBusKeys()
    this.bindFader()
  }

  private bindToggleKeys(): void {
    const keys = this.element.querySelectorAll<HTMLButtonElement>('[data-toggle]')
    keys.forEach((key) => {
      const id = key.dataset.keyId
      if (!id) return
      const color = (key.dataset.color as KeyColor | undefined) ?? 'grey'
      const active = !key.classList.contains('grey')
      this.state.toggles[id] = active
      key.setAttribute('aria-pressed', String(active))

      key.addEventListener('click', () => {
        const next = !this.state.toggles[id]
        this.state.toggles[id] = next
        this.applyKeyColor(key, color, next)
        key.setAttribute('aria-pressed', String(next))
        this.emit('toggle-change', {
          id,
          active: next,
          color: next ? color : 'grey',
        })
      })
    })
  }

  private bindBusKeys(): void {
    const groups = this.element.querySelectorAll<HTMLButtonElement>('[data-group]')
    groups.forEach((key) => {
      const group = key.dataset.group as BusGroup | undefined
      const id = key.dataset.keyId
      if (!group || !id) return
      const active = key.classList.contains('lit-red') || key.classList.contains('lit-green')
      if (active) {
        this.state[group] = id
      }

      key.setAttribute('aria-pressed', String(active))
      key.addEventListener('click', () => {
        if (this.state[group] === id) return
        this.setBusSelection(group, id)
      })
    })
  }

  private bindFader(): void {
    this.updateFaderVisual(this.state.fader)

    this.faderSlot.addEventListener('pointerdown', (event) => {
      this.faderSlot.setPointerCapture(event.pointerId)
      this.updateFaderFromPointer(event.clientY)
    })

    this.faderSlot.addEventListener('pointermove', (event) => {
      if (!this.faderSlot.hasPointerCapture(event.pointerId)) return
      this.updateFaderFromPointer(event.clientY)
    })

    this.faderSlot.addEventListener('pointerup', (event) => {
      if (this.faderSlot.hasPointerCapture(event.pointerId)) {
        this.faderSlot.releasePointerCapture(event.pointerId)
      }
    })
  }

  private updateFaderFromPointer(clientY: number): void {
    const rect = this.faderSlot.getBoundingClientRect()
    const styles = getComputedStyle(this.faderSlot)
    const padding = parseFloat(styles.getPropertyValue('--fader-padding')) || 0
    const minY = rect.top + padding
    const maxY = rect.bottom - padding
    const clampedY = Math.min(Math.max(clientY, minY), maxY)
    const ratio = (clampedY - minY) / (maxY - minY)
    const value = 1 - ratio
    this.setFader(value)
  }

  public setFader(value: number): void {
    const clamped = Math.min(Math.max(value, 0), 1)
    if (clamped === this.state.fader) {
      this.updateFaderVisual(clamped)
      return
    }

    this.state.fader = clamped
    this.updateFaderVisual(clamped)
    this.emit('fader-change', { value: clamped })
  }

  public setBusSelection(group: BusGroup, id: string): void {
    if (this.state[group] === id) return

    const keys = this.element.querySelectorAll<HTMLButtonElement>(`[data-group="${group}"]`)
    keys.forEach((key) => {
      const keyId = key.dataset.keyId
      if (!keyId) return
      const isActive = keyId === id
      this.applyKeyColor(key, group === 'program' ? 'lit-red' : 'lit-green', isActive)
      key.setAttribute('aria-pressed', String(isActive))
    })

    this.state[group] = id
    this.emit('bus-change', { group, id })
  }

  public setToggle(id: string, active: boolean): void {
    const key = this.element.querySelector<HTMLButtonElement>(`[data-toggle][data-key-id="${id}"]`)
    if (!key) return
    const color = (key.dataset.color as KeyColor | undefined) ?? 'grey'
    this.state.toggles[id] = active
    this.applyKeyColor(key, color, active)
    key.setAttribute('aria-pressed', String(active))
  }

  private applyKeyColor(key: HTMLElement, color: KeyColor, active: boolean): void {
    key.classList.remove('grey', 'lit-red', 'lit-amber', 'lit-green')
    key.classList.add(active ? color : 'grey')
  }

  private updateFaderVisual(value: number): void {
    this.faderSlot.style.setProperty('--value', value.toString())
    this.faderSlot.setAttribute('aria-valuenow', value.toFixed(2))

    const litCount = Math.round(value * this.faderSteps.length)
    this.faderSteps.forEach((step, index) => {
      step.classList.toggle('lit', index < litCount)
    })
  }

  private emit<K extends keyof MicroPanelEventMap>(type: K, detail: MicroPanelEventMap[K]): void {
    this.dispatchEvent(new CustomEvent(type, { detail }))
  }
}
