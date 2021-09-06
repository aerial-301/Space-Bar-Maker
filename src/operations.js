import { smelter } from "./initEquipments.js"
import { buttons, g, mainBelt, uiLayer } from "./main.js"

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
const maxShift = 25
const moveSteps = 5
let shiftAmount = 0
let inserted = 0
let randomElement
let index, damage
export let elementsMoving = false
// export let smelter.pushed = false

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

export function addElement(x = 10, y = buttons[0].y - 50) {
  if (Math.random() > .5) {
    index = g.randomNum(0, objects.length)
    randomElement = objects[index]
    index += 1
    damage = 1
  } else {
    index = g.randomNum(0, nonSolids.length)
    randomElement = nonSolids[index]
    damage = (index + 1) * 2
    index = 0
  }
  const t = g.makeText(uiLayer, randomElement, 18, 0, x, y)
  t.value = index * 5
  t.damage = damage
  
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

function moveElementsNOW() {
    for (const item of movingElements) {
      item.x += moveSteps
    }
    shiftAmount += moveSteps
    if (shiftAmount < maxShift) {
      g.wait(1, () => moveElementsNOW())
      
    } else {
      shiftAmount = 0
      
      addElement()
      if (smelter.pushed) {
        if (inserted < 2) {
          inserted += 1
          movingElements.push(mainBelt[0])
          moveElementsNOW()
        } else {
          inserted = 0
          elementsMoving = false
          movingElements.length = 0
          g.wait(7, () => smelter.pushed = false)
          
        }
      } else {
        elementsMoving = false
        movingElements.length = 0
      }
    }
    
  // }
}