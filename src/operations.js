import { g } from "./main.js"
import { buttonsHeight, stackSize } from "./Setup/initButtons.js"
import { bCapacity, machine } from "./Setup/initEquipments.js"
import { uiLayerBG } from "./Setup/initLayers.js"

export const maxStackSize = 10
const moveSteps = 5
const beltSize = 6
const beltStartX = -50

const objects = [
  '📌',
  '📏',
  '📼',
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

const movingElements = []

export const mainBelt = []
export const blockSize = 60

let shiftAmount = 0
let randomElement
let index, damage
export let elementsMoving = false

export function removeElement(n) {
  if (!elementsMoving && !machine.pushed) {
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
    damage = g.randomNum(1, 7)
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
      machine.capacity.f = machine.capacity.full
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
    return
  } else {
    shiftAmount = 0
    addElement()
    movingElements.length = 0
    g.wait(7, () => {
      elementsMoving = false
      machine.pushed = false
    })
  }
}


export function fillBelt() {
  // Fill belt with items at game start
  for (let i = 0; i <= beltSize; i++) {
    addElement(beltStartX + (blockSize * (beltSize - i)))
  }
}
