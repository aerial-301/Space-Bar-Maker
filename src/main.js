import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './initCanvas.js'
import { initEquipments, smelter, space } from './initEquipments.js'
import { blockSize, elementsMoving, insertElement, moveElements, removeElement } from './operations.js'
import { moveToSmelter, startSmelting, toBeSmelted } from './smelt.js'


export let objLayer, mainLayer, buttons = [], uiLayerText, uiLayerBG, buttonsLayer

export const mainBelt = []
const products = []
let stackSize = 0

export const stats = {
  currentCash: 1000,
  displayedCash: 1000,
  repairCost: 0,
}

export const main = {
  action: true,
  process: false,
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
export let cashText
export let displayedCash = 1000
let debug2
let debug3

export let board
export let valueText
export let materialsText
export let operationText


export let totalText


export let valueNum
export let operationNum
export let totalNum
export let repairNum




export let repairText

export let healthText


export let repairButton


export let uiElements = []

g = GA.create(setup)
g.start()

function buttonPress(b) {

  // g.soundEffect = function(frequencyValue, decay, type, volumeValue, pitchBendAmount, reverse, randomValue)
  
  b.f = '#aaa'
  g.wait(60, () => {
    b.f = b.oColor
    g.wait(30, () => main.action = false)
    
  })
}

function initButtons() {
  const buttonsHeight = 580
  
  // const r1 = g.simpleButton('🔻', 314, buttonsHeight, 15, 17, () => {
  //   removeElement(3)
  //   moveElements(2)
  //   buttonPress(r1)
  // }, 12, 50, 50, '#222')

  // const r2 = g.simpleButton('🔻', r1.x + r1.width + 4, buttonsHeight, 15, 17, () => {
  //   removeElement(2)
  //   moveElements(1)
  //   buttonPress(r2)
  // }, 12, 50, 50, '#222')

  const r3 = g.simpleButton('🔻', 300, buttonsHeight, 30, 17, () => {
    if (!elementsMoving && !smelter.pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
    }
    buttonPress(r3)
  }, 12, 80, 50, '#222')

  const push = g.simpleButton('⭡', 390, buttonsHeight - 60, 18, 24, () => {
    
    buttonPress(push)

    if (stackSize < 10) {

      if (elementsMoving || smelter.push || smelter.running || !smelter.ready) return
      g.soundEffect(110, .2, 'sine', 0.2, 1000, true, 0)
      // g.soundEffect(1000, .3, 'triangle', 0.2, 500, false, 0, 0.2)
      // if (!elementsMoving && !smelter.pushed && !smelter.running) {
        smelter.pushed = true
        stackSize += 1
        // const l = mainBelt.length
        // for (let i = 1; i < 2; i++) {
        const item = mainBelt[mainBelt.length - 1]
        g.removeItem(mainBelt, item)
        products.push(item)
        // }
        // products.forEach(p => p.y -= blockSize)
        insertElement(item)
        moveElements()
      // }
    }
    
  }, 70, 80, 110)
  
  const smelt = g.simpleButton('>', 310, 420, 23, 10, () => {    
    if (stackSize == 10) {
      if (smelter.ready && !smelter.running) {
        smelter.running = true
        products.forEach(p => toBeSmelted.push(p))

        startSmelting()
        stackSize = 0
        products.length = 0
      }

    }
    
    buttonPress(smelt)
    
  }, 20, 60, 40, '#900')


  repairButton = g.simpleButton('🔧', 10, buttonsHeight - 150, 25, 15, () => {
    if (!smelter.ready) {
      smelter.fix()
    }

    buttonPress(repairButton)
  }, 20, 80, 50)

  repairButton.visible = false





}




function setup(){

  // debug2 = g.makeText(g.stage, 'text 2', 20, '#FFF', 0, 20)
  // debug3 = g.makeText(g.stage, 'text 3', 20, '#FFF', 0, 40)
  
  initCanvasEvents()
  objLayer = g.group()
  uiLayerBG = g.group()
  buttonsLayer = g.group()
  uiLayerText = g.group()
  mainLayer = g.group(uiLayerBG, objLayer, buttonsLayer, uiLayerText)

  const cashIcon = g.makeText(mainLayer, '💰', 20, 0, 10, 10)
  cashText = g.makeText(mainLayer, `${displayedCash}`, 20, '#FFF', 34, 11)


  
  
  initButtons()

  initEquipments()

  
  
  const frame = g.rectangle(170, 120, '#222', 1, 2, 190)
  uiLayerBG.addChild(frame)
  const bottomLine = g.rectangle(150, 2, '#fff', 0, 8, 270)
  uiLayerText.addChild(bottomLine)
  // result.alpha = 0.5
  
  valueText = g.makeText(uiLayerText, 'Value', 13, '#ddd', 8, 198)
  
  materialsText = g.makeText(uiLayerText, 'Materials = 0', 13, '#ddd', 8, valueText.y + 15)
  
  operationText = g.makeText(uiLayerText, 'Operation', 13, '#ddd', 8, materialsText.y + 15)
  
  totalText = g.makeText(uiLayerText, 'Total', 13, '#ddd', 8, 282)


  valueNum = g.makeText(uiLayerText, '0', 14, '#0d0', 90, 198)
  operationNum = g.makeText(uiLayerText, '0', 14, '#d00', 90, materialsText.y + 15)
  totalNum = g.makeText(uiLayerText, '0', 14, '#ddd', 90, 282)
  

  
  board = g.group(
    frame,
    bottomLine,
    valueText,
    valueNum,
    operationText,
    operationNum,
    totalText,
    totalNum
  )



  // board.visible = false



  const repairFrame = g.rectangle(170, 100, '#222', 1, 2, 420)
  uiLayerBG.addChild(repairFrame)

  repairText = g.makeText(uiLayerText, 'Repair Cost', 14, '#ddd', 8, 490)
  repairNum = g.makeText(uiLayerText, '0', 14, '#d00', 110, 490)
  
  


  const repairBoard = g.group(
    repairFrame,
    repairButton,
    repairText,
    repairNum
  )

  repairBoard.y -= 80

  // repairBoard.visible = false

  // healthText = g.makeText(mainLayer, `Health: ${smelter.health}`, 13, '#FFF', 304, 460)


  // fpsDisplay = g.makeText(mainLayer, 'FPS', 24, '#fff', 0, 100)

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
}