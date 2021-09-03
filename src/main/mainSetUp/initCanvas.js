import { g, mainCanvas, menu, uiElements } from '../../main.js'
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
  g.setCanvasSize()
  updateLayout()
}

function updateLayout () {
  uiElements.forEach(e => e.adjust())
}

window.addEventListener('orientationchange', resize, false);
window.onresize = resize