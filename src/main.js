import { GA } from './modifiedGA.js'
import { loadSavedData, stats } from './Setup/loadSavedData.js'
import { initCanvasEvents } from './Setup/initCanvas.js'
import { initButtons } from './Setup/initButtons.js'
import { initEquipments, machine, space } from './Setup/initEquipments.js'
import { initLeftDisplays } from './Setup/initLeftDisplays.js'
import { initDeleteSaveWindow } from './Setup/initDeleteSaveWindow.js'
import { initLayers } from './Setup/initLayers.js'
import { elementsMoving, fillBelt } from './operations.js'

export let g
export const main = {
  action: true,
  process: false,
}

g = GA.create(setup,['bg.jpg'])
g.start()

function setup(){

  loadSavedData()

  // Set background Image
  g.sprite('bg.jpg')

  initCanvasEvents()

  initLayers()

  initButtons()

  initEquipments()

  initLeftDisplays()

  initDeleteSaveWindow()

  fillBelt()

  g.state = play
  g.wait(100, () => stats.action = false)
}

function play(){
  if ([elementsMoving, machine.running, machine.pushed, space.visible].every(v => v == false)) main.process = false 
  else main.process = true
}





