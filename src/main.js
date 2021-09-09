import { GA } from './ga_minTest.js'
import { initCanvasEvents } from './initCanvas.js'
import { initEquipments, smelter, space } from './initEquipments.js'
import { elementsMoving, insertElement, moveElements } from './operations.js'
import { startSmelting, toBeSmelted } from './smelt.js'

export let objLayer, mainLayer, buttons = [], uiLayerText, uiLayerBG, buttonsLayer
export const mainBelt = []
const products = []

export const maxStackSize = 10

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
export const buttonsHeight = 580
export let menu
export let cashText
export let displayedCash = 1000
let debug2
let debug3
export let stackSize = 0
// let click
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



let BG
// const bgImage = 'background_1.jpg'
const bgImage = 'src/Untitled.jpg'

g = GA.create(setup,[
  bgImage
])
g.start()

function buttonPress(b) {
  if(b.visible) {
    // buttonClick.play()
    b.f = '#aaa'
    g.wait(60, () => {
      b.f = b.oColor
      g.wait(30, () => main.action = false)
      
    })

  }
}

function initButtons() {

  const r3 = g.simpleButton('🔻', 300, buttonsHeight + 10, 17, 37, () => {
    if (!elementsMoving && !smelter.pushed) {
      mainBelt.pop().visible = false
      moveElements(0)

      g.soundEffect(
        320,          //frequency
        .1,           //decay
        "sine",  //waveform
        0.06,           //volume
        113,           //pitch bend amount
        false,
        0,
        0
      )
    }
    buttonPress(r3)
  }, 32, 80, 130, '#222')

  const push = g.simpleButton('⭡', 390, buttonsHeight - 60, 18, 24, () => {
    
    buttonPress(push)

    if (stackSize < 10) {
      if (elementsMoving || smelter.push || smelter.running || !smelter.ready) return

      smelter.pushed = true
      stackSize += 1
      const item = mainBelt[mainBelt.length - 1]

      if (item.isMetal) {
        g.soundEffect(
          200,          //frequency
          .08,           //decay
          "triangle",  //waveform
          0.3,           //volume
          300,           //pitch bend amount
          true
        )
      } else {
        g.soundEffect(
          130,          //frequency
          .1,           //decay
          "sawtooth",  //waveform
          0.07,           //volume
          50,           //pitch bend amount
          false,
          0,
          12
        )
      }

      g.removeItem(mainBelt, item)
      products.push(item)

      insertElement(item)
      moveElements()
    }
    
  }, 70, 80, 200)
  
  const smelt = g.simpleButton('>', 310, 420, 23, 10, () => {
    // press.restart()
    if (stackSize == maxStackSize) {
      if (smelter.ready && !smelter.running) {

        g.soundEffect(
          80,
          1.2,
          "sawtooth",
          0.03,
          30,
          true,
          0,
          10
        )


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

  // BG = g.sprite('src/background_1.png');
  BG = g.sprite(bgImage);

  initCanvasEvents()
  objLayer = g.group()
  uiLayerBG = g.group()
  buttonsLayer = g.group()
  uiLayerText = g.group()
  mainLayer = g.group(uiLayerBG, objLayer, buttonsLayer, uiLayerText)

  g.makeText(mainLayer, '💰', 20, 0, 10, 10)
  cashText = g.makeText(mainLayer, `${displayedCash}`, 20, '#FFF', 34, 11)
  
  initButtons()

  initEquipments()

  const frame = g.rectangle(170, 120, '#000', 1, 2, 190)
  uiLayerBG.addChild(frame)
  const bottomLine = g.rectangle(150, 2, '#fff', 0, 8, 270)
  uiLayerText.addChild(bottomLine)
  
  valueText = g.makeText(uiLayerText, 'Value', 18, '#ddd', 8, 198)
  
  // materialsText = g.makeText(uiLayerText, 'Materials = 0', 13, '#ddd', 8, valueText.y + 15)
  
  operationText = g.makeText(uiLayerText, 'Operation', 18, '#ddd', 8, valueText.y + 30)
  
  totalText = g.makeText(uiLayerText, 'Total', 18, '#ddd', 8, 282)

  valueNum = g.makeText(uiLayerText, '0', 16, '#0e0', 114, 200)
  operationNum = g.makeText(uiLayerText, '0', 16, '#f00', 114, valueNum.y + 30)
  totalNum = g.makeText(uiLayerText, '0', 16, '#ddd', 114, 282)
    
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

  const repairFrame = g.rectangle(170, 100, '#111', 1, 2, 420)
  uiLayerBG.addChild(repairFrame)

  repairText = g.makeText(uiLayerText, 'Repair Cost', 15, '#ddd', 8, 490)
  repairNum = g.makeText(uiLayerText, '0', 16, '#d00', 110, 490)
  
  const repairBoard = g.group(
    repairFrame,
    repairButton,
    repairText,
    repairNum
  )

  repairBoard.y -= 80

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