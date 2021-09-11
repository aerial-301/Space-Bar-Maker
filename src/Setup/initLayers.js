import { g } from "../main.js"

export let objLayer, mainLayer, uiLayerText, uiLayerBG, buttonsLayer
export function initLayers() {
  objLayer = g.group()
  uiLayerBG = g.group()
  buttonsLayer = g.group()
  uiLayerText = g.group()
  mainLayer = g.group(uiLayerBG, objLayer, buttonsLayer, uiLayerText)
}