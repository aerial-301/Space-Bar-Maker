import { buttons, g } from './main.js'

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
}
// const pointerUp = (e) => {
//   if (e.button === 0) leftMouseUp()
// }

const leftMouseDown = () => {
  for (const button of buttons) {
    if (g.hitTestPoint(g.pointer, button)) {
      button.action()
    }
  }


}
// const leftMouseUp = () => {
// }

export { pointerDown }
