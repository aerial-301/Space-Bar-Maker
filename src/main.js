import { GA } from './modifiedGA.js'
import { initCanvasEvents } from './initCanvas.js'
import { initButtons } from './initButtons.js'
import { initEquipments, smelter, space } from './initEquipments.js'
import { elementsMoving } from './operations.js'
import { initLeftDisplays } from './initLeftDisplays.js'
import { initDeleteSaveWindow } from './initDeleteSaveWindow.js'
import { loadSavedData } from './loadSavedData.js'

const bgImage = 'src/Untitled.jpg'
export const statsKey = 'SpaceBarMakerJS13K2021'
export const mainBelt = []
export const maxStackSize = 10
export const buttonsHeight = 580
export const stats = {}
export const main = {
  action: true,
  process: false,
}

export let g
export let objLayer, mainLayer, buttons = [], uiLayerText, uiLayerBG, buttonsLayer
export let menu 

g = GA.create(setup,[bgImage])
g.start()

function setup(){

  loadSavedData()

  // Set background Image
  g.sprite(bgImage)

  initCanvasEvents()

  // Initialize Layers
  objLayer = g.group()
  uiLayerBG = g.group()
  buttonsLayer = g.group()
  uiLayerText = g.group()
  mainLayer = g.group(uiLayerBG, objLayer, buttonsLayer, uiLayerText)

  initButtons()

  initEquipments()

  initLeftDisplays()

  initDeleteSaveWindow()

  g.state = play
  g.wait(100, () => stats.action = false)
}

function play(){
  if ([elementsMoving, smelter.running, smelter.pushed, space.visible].every(v => v == false)) main.process = false 
  else main.process = true
}
