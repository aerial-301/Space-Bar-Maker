import { g } from '../../main.js'
export let world, uiLayer, floorLayer, objLayer
export const initLayers = () => {

  floorLayer = g.group()
  objLayer = g.group()
  world = g.group(floorLayer, objLayer)
  uiLayer = g.group()
}
