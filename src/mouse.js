import { g } from './main.js'
import { buttons } from './main/mainSetUp/initBottomPanel.js'
// import { gridMap, mine } from './main/mainSetUp/initMap.js'
// import { world, floorLayer } from './main/mainSetUp/initLayers.js'
// import { getUnitVector, sortUnits, setDirection, checkNeighbors, notEnough } from './functions.js'
// import { rectangle } from './drawings.js'
// import { currentPlayer, UC } from './keyboard.js'
// import { buttons, currentGold, goldDisplay, prices } from './main/mainSetUp/initBottomPanel.js'
// import { bluePrint } from './main/mainLoop/showBluePrint.js'
// import { turret } from './unitObject.js'

const pointerDown = (e) => {
  if (e.button === 0) leftMouseDown()
  // else if (e.button === 2) rightMouseDown()
}
const pointerUp = (e) => {
  if (e.button === 0) leftMouseUp()
}

const leftMouseDown = () => {
  for (const button of buttons) {
    // console.log(button)
    if (g.hitTestPoint(g.pointer, button)) {
      button.action()
      
      // console.log('pointer = ', g.pointer.x.toFixed(2), g.pointer.y.toFixed(2))
      // console.log('button = ', button.gx, button.gy)
    }
  }


}
const leftMouseUp = () => {
}

export { pointerDown, pointerUp, }
