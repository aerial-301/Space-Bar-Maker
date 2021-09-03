// import { movingUnits } from './main.js'
import { world, objLayer } from './main/mainSetUp/initLayers.js'
// import { rectangle } from './drawings.js'
// import { makeText } from './unitObject.js'
// import { currentPlayer } from './keyboard.js'

export const directions = [
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
  [0, -1],
  [1, -1]
]

//const tempAngle = (a, b, bOffsetX = 0, bOffsetY = 0) => {return Math.atan2((b.centerX + bOffsetX - a.centerX), (b.centerY + bOffsetY - a.centerY))}

const canBuildHere = (gridMap, r, c) => {
  try {if (!gridMap[r][c] && checkNeighbors(gridMap,r, c)) return true}
  catch (e) {}
  return false
}
const checkNeighbors = (gridMap, row, col) => {
  let n
  for (let d of directions) {
    n = addVectors([row, col], d)
    try {
      if (gridMap[n[0]][n[1]] != 0) return false
    } catch (e) {}
  }
  return true
}

const getUnitVector = (a, b) => {
  let xv, yv
  xv = b.centerX - a.centerX
  yv = b.centerY - a.centerY
  const mag = Math.sqrt( (xv**2) + (yv**2) )
  return { x: xv / mag, y: yv / mag }
}
const moveX = (u) => {
  const xD = u.destinationX - u.x
  const xd = Math.abs(xD)
  if (!u.isCollidingV) {
    if (xd > u.speed + (u.getInRange ? u.range / Math.sqrt(2) - 95 : 0)) {
      u.x += u.vx * u.speed
      if (u.obstacles.length > 0) {
        if (xD != 0) avoidObstacles(u, 1)
      }
      u.scan(1500, OBSDIST)
      return true
    } else return false
  } else u.x += u.vx * u.speed
}
const moveY = (u) => {
  objLayer.children.sort((a, b) => a.bottom - b.bottom)
  const yD = u.destinationY - u.y
  const yd = Math.abs(yD)
  if (!u.isCollidingH) {
    if (yd > u.speed + (u.getInRange ? u.range / Math.sqrt(2) - 45 : 0)) {
      u.y += u.vy * u.speed
      if (u.obstacles.length > 0) {
        if (yD != 0) avoidObstacles(u, 0)
      }
      u.scan(1500, OBSDIST)
      return true
    } else return false
  } else u.y += u.vy * u.speed
}
const moveUnit = (u) => {
  const x = moveX(u)
  const y = moveY(u)

  if (!x && !y) {
    removeItem(movingUnits, u)
    u.getInRange = false
    u.isMoving = false
  }
}

export {
  checkNeighbors,
  // simpleButton,
  // addNewItem,
  // removeItem,
  // randomNum,
  getUnitVector,
  // xDistance,
  // yDistance,
  moveUnit,
  canBuildHere
}
