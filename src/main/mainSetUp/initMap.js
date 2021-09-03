// import { checkNeighbors, directions, randomNum } from '../../functions.js'
// import { surfaceLine, moonHole, makeHQ, makeMine } from '../../drawings.js'
import { cellSize, g, surfaceHeight, surfaceWidth} from '../../main.js'
// import { floorLayer } from './initLayers.js'
// import { turret } from '../../unitObject.js'

let mine, HQ, gridMap = []

export const initMap = () => {

  const rows = (surfaceHeight / cellSize) | 0
  const cols = (surfaceWidth / cellSize) | 0

  for (let i = 0; i < rows; i++) gridMap[i] = Array(cols).fill(0)


  for (let row = 0; row < rows; row++) {
    for (let cel = 0; cel < cols; cel++) {
      g.rectangle(100, 100)
    }
  }

}

export {
  gridMap,
  HQ,
  mine
}