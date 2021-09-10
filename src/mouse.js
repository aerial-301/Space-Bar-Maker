import { buttons, g, main } from './main.js'

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
}

const leftMouseDown = () => {
  for (const button of buttons) {
    if (g.hitTestPoint(g.pointer, button)) {
      main.action = true
      button.action()
    }
  }
}

export { pointerDown }
