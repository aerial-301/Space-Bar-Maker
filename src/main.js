import { GA } from './ga_minTest.js'
import { buttons } from './main/mainSetUp/initBottomPanel.js'
import { initLayers, uiLayer } from './main/mainSetUp/initLayers.js'
import { canvas, initCanvasEvents } from './main/mainSetUp/initCanvas.js'
import { initMap } from './main/mainSetUp/initMap.js'
import { debugShape } from '../debug.js'



export const mainCanvas = {
  get width() { return canvas.width },
  get height() { return canvas.height}
}


const surfaceWidth = 414
const surfaceHeight = 812
const cellSize = 73
const PI = Math.PI

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


export let uiElements = []


g = GA.create(mainMenu)
g.start()

function setSize(element, p1, p2) {
  if (mainCanvas.width < mainCanvas.height) {
    element.width = mainCanvas.width * p1
    element.height = mainCanvas.height * p2
  } else {
    element.width = mainCanvas.width * p2
    element.height = mainCanvas.height * p1
  }
}

function setPos(element, p1, p2, xOffset = 0, yOffset = 0) {
  element.x = mainCanvas.width * p1 + xOffset
  element.y = mainCanvas.height * p2 + yOffset
}



function adjustElement(e, x, y, xOff, yOff, w, h, tx, ty) {

  setSize(e, w, h)
  e.text.x = e.width * tx
  e.text.y = e.height * ty
}

function mainMenu(){
  initCanvasEvents()
  
  initLayers()
  menu = g.simpleButton('>', 0, 0, 0, 0, '#080', 20, () => {
  })
  menu.adjust = () => {
    adjustElement(menu, 0, 1, 0, -menu.height, .2, .1, .4, .4)
    setPos(menu, 0, 1, 0, -menu.height)
  }



  uiElements.push(menu)
  buttons.push(menu)
  uiLayer.addChild(menu)
  uiElements.forEach(e => e.adjust())
  setup()
}


let theText = g.makeText(g.stage, 'text 1', '', '#FFF')
let theText2 = g.makeText(g.stage, 'text 2', '', '#FFF', 0, 100)

function setup(){

  initMap()

  g.state = play
}

function play(){

  // theText.content = `
  // ${g.pointer.x.toFixed(2)}
  // ${g.pointer.y.toFixed(2)}
  // `

  // theText2.content = `
  // ${menu.gx.toFixed(2)}
  // ${menu.gy.toFixed(2)}
  // `

  // if (g.hitTestPoint(g.pointer, menu)) {
  //   menu.f = '#FFF'
  //   g.wait(50, () => {
  //     menu.f = '#800'
  //   })
  //   console.log('pointer = ', g.pointer.x.toFixed(2), g.pointer.y.toFixed(2))
  //   console.log('button = ', menu.gx, menu.gy)
  // }

}

export { 
  g,
  K,
  PI,
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