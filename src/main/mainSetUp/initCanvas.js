import { g, menu, uiElements } from '../../main.js'
import { pointerDown, pointerUp } from '../../mouse.js'
export let canvas
export const initCanvasEvents = () => {
  if (canvas) return
  canvas = document.getElementById('c')
  canvas.addEventListener('contextmenu', e => e.preventDefault())
  canvas.addEventListener('pointerdown', e => pointerDown(e))
  canvas.addEventListener('pointerup', e => pointerUp(e))
}

function resize () {
  // g.setCanvasSize()
  // updateLayout()
  canvas.height = window.innerHeight
  let scaleToFit = Math.min(
    window.innerWidth / g.canvas.width, 
    g.canvas.height / window.innerHeight
  )
  g.canvas.style.transformOrigin = "0 0";
  g.canvas.style.transform = "scale(" + scaleToFit + ")";
  g.scale = scaleToFit
}

// function updateLayout () {
//   uiElements.forEach(e => e.adjust())
// }

// window.addEventListener('orientationchange', resize, false);
window.onresize = resize