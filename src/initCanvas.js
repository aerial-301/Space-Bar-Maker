import { g } from './main.js'
import { pointerDown } from './mouse.js'
export let canvas
export const initCanvasEvents = () => {
  if (canvas) return
  canvas = document.getElementById('c')
  canvas.addEventListener('contextmenu', e => e.preventDefault())
  canvas.addEventListener('pointerdown', e => pointerDown(e))
}

window.onresize = resize

function resize () {
  let scaleToFit = Math.min(
    window.innerWidth / g.canvas.width, 
    window.innerHeight / g.canvas.height
  )
  g.canvas.style.transform = "scale(" + scaleToFit + ")";
  const cMargin = (window.innerWidth - g.canvas.width * scaleToFit) / 2
  g.canvas.style.margin = `0 ${cMargin}px`
  g.scale = scaleToFit
}
