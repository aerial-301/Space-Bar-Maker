import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './initCanvas.js'
import { initEquipments, smelter, space } from './initEquipments.js'
import { elementsMoving, moveElements, removeElement } from './operations.js'
import { moveToSmelter, toBeSmelted } from './smelt.js'
// import { debugShape } from '../debug.js'

export let uiLayer, layer2, buttons = []

export const mainBelt = []
const products = []
let stackSize = 0

export const stats = {
  currentCash: 1000,
  displayedCash: 1000,
  repairCost: 0,

  // operationCost: 0,
  // sellValue: 0,
}

export const main = {
  action: true,
  process: false,
}

// let actions

// let fpsDisplay

// const surfaceWidth = 414
// const surfaceHeight = 812
// const cellSize = 73
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
// let solids = []
// let units = []
// let playerUnits = []
// let selectedUnits = []
// let movingUnits = []
// let armedUnits = []
// let enemies = []
// let attackingTarget = []
// let shots = []
// let bloodDrops = []
// let fadeOuts = []
// let miners = []


// let smelting = false

export let cashText
export let displayedCash = 1000
let debug2
let debug3

export let valueText
export let operationText
export let totalText
export let healthText
export let repairText


export let uiElements = []

g = GA.create(setup)
g.start()

function buttonPress(b) {

  b.f = '#FFF'
  
  g.wait(60, () => {
    b.f = '#080'
    g.wait(10, () => main.action = false)
    
  })
}

function initButtons() {
  const buttonsHeight = 580
  
  const r1 = g.simpleButton('r1', 250, buttonsHeight, 8, 10, () => {
    removeElement(3)
    moveElements(2)
    buttonPress(r1)
  })

  const r2 = g.simpleButton('r2', r1.x + r1.width + 4, buttonsHeight, 8, 10, () => {
    removeElement(2)
    moveElements(1)
    buttonPress(r2)
  })

  const r3 = g.simpleButton('r3', r2.x + r2.width + 4, buttonsHeight, 8, 10, () => {
    if (!elementsMoving && !smelter.pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
    }
    buttonPress(r3)
  })

  const push = g.simpleButton('Push', 175, buttonsHeight, 8, 10, () => {
    if (stackSize < 10) {
      if (!elementsMoving && !smelter.pushed) {
        smelter.pushed = true
        stackSize += 1
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
  
  const smelt = g.simpleButton('Smelt', 100, buttonsHeight, 8, 10, () => {    
    if (stackSize == 10) {
      if (smelter.ready && !smelter.running) {
        smelter.running = true
        products.forEach(p => toBeSmelted.push(p))

        moveToSmelter()
        stackSize = 0
        products.length = 0
      }

    }
    
    buttonPress(smelt)
  })


  const repair = g.simpleButton('Repair', 0, buttonsHeight, 8, 10, () => {
    if (smelter.health <= 0) {
      smelter.fix()
    }

    buttonPress(repair)
  })






}




function setup(){

  // debug2 = g.makeText(g.stage, 'text 2', 20, '#FFF', 0, 20)
  // debug3 = g.makeText(g.stage, 'text 3', 20, '#FFF', 0, 40)
  
  initCanvasEvents()
  uiLayer = g.group()
  layer2 = g.group()

  const cashIcon = g.makeText(layer2, '💰', 20, 0, 10, 10)
  cashText = g.makeText(layer2, `${displayedCash}`, 20, '#FFF', 34, 11)
  
  initButtons()

  initEquipments()


  valueText = g.makeText(layer2, 'Value = 0', 14, '#ddd', 4, 200)
  operationText = g.makeText(layer2, 'Operation cost = 0', 14, '#ddd', 4, 215)
  totalText = g.makeText(layer2, 'Total = 0', 14, '#ddd', 4, 250)
  repairText = g.makeText(layer2, 'Repair Cost = 0', 14, '#ddd', 4, 490)
  
  healthText = g.makeText(layer2, `Health: ${smelter.health}`, 13, '#FFF', 304, 390)


  // fpsDisplay = g.makeText(layer2, 'FPS', 24, '#fff', 0, 100)

  // actions = [
  //   elementsMoving,
  //   smelter.pushed,
  //   space.visible,
  // ]

  g.state = play
  g.wait(90, () => stats.action = false)
}

function play(){
  
  if ([elementsMoving, smelter.running, smelter.pushed, space.visible].every(v => v == false)) {
    main.process = false 
  } else {
    main.process = true
  }

}

export { 
  g,
  currentAction,
}