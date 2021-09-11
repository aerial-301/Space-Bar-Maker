import { g, main } from './main.js'
import { buttons } from './Setup/initButtons.js'

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
}

export const leftMouseDown = () => {
  for (const button of buttons) {
    if (g.hitTestPoint(g.pointer, button)) {
      main.action = true
      button.action()
    }
  }
}

export { pointerDown }
