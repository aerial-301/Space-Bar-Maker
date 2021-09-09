import { bCapacity, beltStartX, smelter } from "./initEquipments.js"
import { buttons, buttonsHeight, g, mainBelt, maxStackSize, stackSize, uiLayerBG } from "./main.js"

const objects = [
  '📌',
  '📏',
  '📼',
  // '🔧',
  '📞',
  '🛒',
  '📢',
  '🎤',
  '🚲',
  '🎧',
  '🎮',
  '📷',
  '🏆',
  '💎',
]

const nonSolids = [
  '🍓',
  '🍇',
  '🍏',
  '🍉',
  '🍖',
  '🍰',
  '🍔',
  '🐓',
  '🐠',
  '🐁',
]

const uiStuff = [
  '💰',
  '💵',
  '⭐'
]

const movingElements = []

export const blockSize = 60

const moveSteps = 5
let shiftAmount = 0
let randomElement
let index, damage
export let elementsMoving = false

export function removeElement(n) {
  if (!elementsMoving && !smelter.pushed) {
    const index = mainBelt.length - n
    const item = mainBelt[index]
    if (item) {
      g.removeItem(mainBelt, item)
      item.visible = false
    }
  }
}

let isMetal

export function addElement(x = beltStartX, y = buttonsHeight - 50) {
  if (Math.random() > .5) {
    index = g.randomNum(0, objects.length)
    randomElement = objects[index]
    isMetal = true
    index += 1
    damage = 1
  } else {
    index = g.randomNum(0, nonSolids.length)
    randomElement = nonSolids[index]
    isMetal = false
    damage = (index + 1) * 10
    index = 0
  }
  const t = g.makeText(uiLayerBG, randomElement, 40, 0, x, y)
  t.value = index * 15
  t.damage = damage
  t.isMetal = isMetal
  
  mainBelt.unshift(t)
}

export function moveElements(n = 0) {
  if (!elementsMoving) {
    elementsMoving = true
    const index = mainBelt.length - n

    for (let i = 0; i < index; i++) {
      movingElements.push(mainBelt[i])
    }

    moveElementsNOW()
  }
  
}

const insertFinal = 80
const insertSteps = 10
let insertAmount = 0

export function insertElement(item) {
  item.y -= insertSteps
  insertAmount += insertSteps
  if (insertAmount < insertFinal) {
    g.wait(1, () => insertElement(item))
  } else {
    insertAmount = 0
    item.visible = false
    bCapacity.height -= 30
    if (stackSize == maxStackSize) {
      smelter.capacity.f = smelter.capacity.full
    }
  }
}

function moveElementsNOW() {
  for (const item of movingElements) {
    item.x += moveSteps
  }
  shiftAmount += moveSteps
  if (shiftAmount < blockSize) {
    g.wait(1, () => moveElementsNOW())
    
  } else {
    shiftAmount = 0
    addElement()
    movingElements.length = 0
    g.wait(7, () => {
      elementsMoving = false
      smelter.pushed = false
    })
  }
}