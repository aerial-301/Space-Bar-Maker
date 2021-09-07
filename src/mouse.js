import { buttons, g, main, stats } from './main.js'

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
}
// const pointerUp = (e) => {
//   if (e.button === 0) leftMouseUp()
// }

const leftMouseDown = () => {
  for (const button of buttons) {
    if (g.hitTestPoint(g.pointer, button)) {
      main.action = true
      button.action()

      // g.wait(80, () => {
      //   stats.action = false
      // })
    }
  }


}
// const leftMouseUp = () => {
// }

export { pointerDown }
