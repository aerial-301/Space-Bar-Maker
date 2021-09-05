import { GA } from './ga_minTest.js'
import { canvas, initCanvasEvents } from './initCanvas.js'
// import { debugShape } from '../debug.js'

export let uiLayer, layer2, buttons = []

const objects = [
  '🎮',
  // '🍴',
  '🎹',
  '🎧',
  '🎥',
  '🎤',
  '🏆',
  '💍',
  // '📎',
  '📏',
  '📐',
  '📞',
  '📢',
  '📷',
  '📼',
  '📿',
  '🔧',
  '📌',
  '🛒',
  '🚲'
]

const nonSolids = [
  '🍖',
  '🍔',
  // '🍕',
  '🍓',
  '🍎',
  '🍉',
  '🍅',
  '🍰',
  '🐁',
  '🐠',
  '🐓'
]

const uiStuff = [
  '💵',
  '⭐'
]

const building = [
  '🏭',
]

const movingElements = []

let elementsCanMove = true


const maxShift = 25
const moveSteps = 5
let shiftAmount = 0


const mainBelt = []

const products = []

let pushed = false

let stackSize = 0

let inserted = 0

const surfaceWidth = 414
const surfaceHeight = 812
const cellSize = 73
// const PI = Math.PI

const currentAction = {
  placingBuilding: false,
  started: false
}

const K = {
  b : '#000',
  w : '#fff',
  r : '#f00',
  y : '#ff0',
  g : '#555'
}

let g
export let menu
let solids = []
let units = []
let playerUnits = []
let selectedUnits = []
let movingUnits = []
let armedUnits = []
let enemies = []
let attackingTarget = []
let shots = []
let bloodDrops = []
let fadeOuts = []
let miners = []

let toBeSmelted = []
let smelting = false

let debug1
let debug2
let debug3


let smelter
let randomElement

let finishedProduct

let smeltTime, currentSmeltTime
let smelterProgressBar


let space

export let uiElements = []

g = GA.create(setup)
g.start()

function buttonPress(b) {
  b.f = '#FFF'
    g.wait(60, () => b.f = '#800')
}

function removeElement(n) {
  if (elementsCanMove && !pushed) {
    const index = mainBelt.length - n
    const item = mainBelt[index]
    if (item) {
      g.removeItem(mainBelt, item)
      item.visible = false
    }
  }
}

function addElement(x = 10, y = buttons[0].y - 50) {
  if (Math.random() > .5) randomElement = objects[g.randomNum(0, objects.length)]
  else randomElement = nonSolids[g.randomNum(0, nonSolids.length)]
  const t = g.makeText(uiLayer, randomElement, 18, 0, x, y)
  mainBelt.unshift(t)
}

function moveElements(n = 0) {
  if (elementsCanMove) {
    elementsCanMove = false
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
      if (pushed) {
        if (inserted < 2) {
          inserted += 1
          movingElements.push(mainBelt[0])
          moveElementsNOW()
        } else {
          pushed = false
          inserted = 0
          elementsCanMove = true
          movingElements.length = 0
        }
      } else {
        elementsCanMove = true
        movingElements.length = 0
      }
    }
    
  // }
}

const productsMaxMove = 75
let productsMoveAmount = 0

function moveToSmelter() {
  if (productsMoveAmount < productsMaxMove) {
    productsMoveAmount += 5
    toBeSmelted.forEach(p => p.x -= 5)
    g.wait(5, () => {
      moveToSmelter()
    })
  } else {
    productsMoveAmount = 0
    startSmelting()
  }
}

function startSmelting() {

  smeltTime = g.randomNum(50, 100)
  currentSmeltTime = 0
  smelter.doneBar.visible = false
  



  smelt()

  toBeSmelted.forEach(p => g.remove(p))
  toBeSmelted.length = 0
  smelting = false
}

function smelt() {
  if (currentSmeltTime < smeltTime) {
    currentSmeltTime += 1
    smelter.bar.width = (currentSmeltTime / smeltTime) * 60
    g.wait(5, () => smelt())
  } else {
    smelter.doneBar.visible = true
    leftAmount = 0
    upAmount = 0
    space.visible = true
    eject()
  }
}

const leftSteps = 115
const upSteps = 500
let leftAmount, upAmount

function eject() {
  if (leftAmount < leftSteps) {
    leftAmount += 5
    space.x -= 5
    g.wait(1, eject)
  } else {
    g.wait(500, moveUp)
    
  }
}


function moveUp() {
  if (upAmount < upSteps) {
    upAmount += 7
    space.y -= 7
    g.wait(1, moveUp)
  } else {
    space.visible = false
    space.x = 310
    space.y = 75
  }
}




function initButtons() {
  const buttonsHeight = 540
  
  const r1 = g.simpleButton('Discard', 4, buttonsHeight, 8, 10, () => {
    removeElement(3)
    moveElements(2)
    buttonPress(r1)
  })

  const r2 = g.simpleButton('Remove', r1.x + r1.width + 4, buttonsHeight, 8, 10, () => {
    removeElement(2)
    moveElements(1)
    buttonPress(r2)
  })

  const r3 = g.simpleButton('Delete', r2.x + r2.width + 4, buttonsHeight, 8, 10, () => {
    if (elementsCanMove && !pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
    }
    buttonPress(r3)
  })

  const push = g.simpleButton('Push', r3.x + r3.width + 4, buttonsHeight, 8, 10, () => {
    if (stackSize < 10) {
      if (elementsCanMove && !pushed) {
        stackSize += 1
        pushed = true
        const l = mainBelt.length
        for (let i = 1; i < 4; i++) {
          const item = mainBelt[l - i]
          g.removeItem(mainBelt, item)
          products.push(item)
        }
        products.forEach(p => p.y -= 40)
        moveElements()
      }
    }
    buttonPress(push)
  })
  
  const smelt = g.simpleButton('Smelt', push.x + push.width + 4, buttonsHeight, 8, 10, () => {    
    if (stackSize == 10) {
      if (!smelting) {

        smelting = true
        products.forEach(p => toBeSmelted.push(p))

        moveToSmelter()
        stackSize = 0
        products.length = 0
      }

    }
    
    
    buttonPress(smelt)
  })
}


function setup(){

  debug1 = g.makeText(g.stage, 'text 1', 20, '#FFF')
  debug2 = g.makeText(g.stage, 'text 2', 20, '#FFF', 0, 20)
  debug3 = g.makeText(g.stage, 'text 3', 20, '#FFF', 0, 40)

  initCanvasEvents()
  uiLayer = g.group()
  layer2 = g.group()

  initButtons()

  
  const packaging = g.rectangle(100, 50, '#333', 1, 180, 0)
  layer2.addChild(packaging)

  smelter = g.rectangle(80, 410, '#222', 2, 305, 70)
  layer2.addChild(smelter)

  const smelterBarEmpty = g.rectangle(60, 20, '#000', 0, 315, 440)
  layer2.addChild(smelterBarEmpty)

  smelter.bar = g.rectangle(60, 20, '#ff0', 0, 315, 440)
  layer2.addChild(smelter.bar)
  

  smelter.doneBar = g.rectangle(60, 20, '#0f0', 0, 315, 440)
  layer2.addChild(smelter.doneBar)
  // smelter.doneBar.visible = false

  
  space = g.rectangle(70, 400, '#777', 2, 310, 75)
  space.visible = false
  uiLayer.addChild(space)


  const beltSize = 17
  for (let i = 0; i <= beltSize; i++) {
    addElement(10 + (25 * (beltSize - i)))
  }

}

function play(){
  debug1.content = `stack = ${stackSize}`
  debug2.content = `products = ${products.length}`
  debug3.content = `canvas ${canvas.width} , ${canvas.height}`
  // debug1.content = `${window.innerWidth}`
  // debug2.content = `${window.innerHeight}`
  // debug3.content = `canvas ${canvas.width} , ${canvas.height}`


}

export { 
  g,
  K,
  // PI,
  currentAction,
  surfaceHeight,
  surfaceWidth,
  units,
  playerUnits,
  selectedUnits,
  movingUnits,
  miners,
  enemies,
  shots,
  solids,
  attackingTarget,
  armedUnits,
  bloodDrops,
  fadeOuts,
  cellSize
}