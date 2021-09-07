import { g, mainLayer, repairButton, repairNum, stats, objLayer, uiLayerBG } from "./main.js"
import { addElement, blockSize } from "./operations.js"
import { changeValue } from "./smelt.js"

const beltSize = 5



export let smelter
export let space


 export let bCapacity

export function initEquipments() {

  // const xPos = 25 * (beltSize - 5)
  const xPos = 300
  const yPos = 100
  // const smelterBaseHealth = 250

  // smelter = g.rectangle(80, 410, '#333', 2, xPos, 110)
  smelter = g.rectangle(80, 410, '#333', 2, xPos, yPos)
  smelter.ready = true
  smelter.running = false
  smelter.pushed = false
  smelter.baseHealth = 300
  smelter.health = smelter.baseHealth

  objLayer.addChild(smelter)

  const smelterBarEmpty = g.rectangle(60, 20, '#000', 0, 10, 370)
  smelter.addChild(smelterBarEmpty)

  smelter.bar = g.rectangle(60, 20, '#ff0', 0, 10, 370)
  smelter.addChild(smelter.bar)
  // smelter.bar.visible = false
  

  smelter.readyBar = g.rectangle(60, 20, '#0f0', 0, 10, 370)
  smelter.addChild(smelter.readyBar)
  // smelter.readyBar.visible = false
  
  smelter.breakBar = g.rectangle(60, 20, '#f00', 0, 10, 370)
  smelter.addChild(smelter.breakBar)
  smelter.breakBar.visible = false


  const HB = g.rectangle(8, 300, '#0f0', 2, 10, 10)
  smelter.addChild(HB)

  const capacity = g.rectangle(8, 300, '#b50', 2, 62, 10)
  smelter.addChild(capacity)


  bCapacity = g.rectangle(8, 300, '#000', 2, 62, 10)
  smelter.addChild(bCapacity)


  
  smelter.healthBar = g.rectangle(8, 0, '#000', 0, xPos + 10, yPos + 10)
  mainLayer.addChild(smelter.healthBar)
  // smelter.healthBar.visible = false
  

  smelter.break = () => {
    smelter.breakBar.visible = true
    smelter.ready = false
    smelter.running = false
    // smelter.running = false
    // smelter.isWorking = false
  }
  
  smelter.fix = () => {
    stats.currentCash -= stats.repairCost
    changeValue()
    stats.repairCost = 0
    // repairText.content = `Repair Cost = ${stats.repairCost}`
    repairNum.content = 0

    smelter.health = smelter.baseHealth
    // healthText.content = `Health: ${smelter.health}`
    smelter.healthBar.height = 0
    smelter.breakBar.visible = false
    smelter.readyBar.visible = true
    smelter.ready = true
    smelter.running = false
    repairButton.visible = false
  }

  
  space = g.rectangle(70, 400, '#777', 2, xPos + 5, 105)
  space.xOrigin = space.x
  space.yOrigin = space.y
  space.visible = false
  uiLayerBG.addChild(space)
  // mainLayer.addChild(space)


  const packaging = g.rectangle(100, 50, '#333', 1, 180, 0)
  mainLayer.addChild(packaging)




  for (let i = 0; i <= beltSize; i++) {
    addElement(10 + (blockSize * (beltSize - i)))
  }


}