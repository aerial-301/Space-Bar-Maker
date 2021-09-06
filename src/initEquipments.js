import { g, healthText, layer2, repairText, stats, uiLayer } from "./main.js"
import { addElement } from "./operations.js"
import { changeValue } from "./smelt.js"

const beltSize = 17

export let smelter
export let space

export function initEquipments() {

  const xPos = 25 * (beltSize - 5)
  // const smelterBaseHealth = 250

  smelter = g.rectangle(80, 410, '#333', 2, xPos, 110)
  smelter.ready = true
  smelter.running = false
  smelter.pushed = false
  smelter.baseHealth = 250
  smelter.health = smelter.baseHealth

  layer2.addChild(smelter)

  const smelterBarEmpty = g.rectangle(60, 20, '#000', 0, xPos + 10, 480)
  layer2.addChild(smelterBarEmpty)

  smelter.bar = g.rectangle(60, 20, '#ff0', 0, xPos + 10, 480)
  layer2.addChild(smelter.bar)
  

  smelter.readyBar = g.rectangle(60, 20, '#0f0', 0, xPos + 10, 480)
  layer2.addChild(smelter.readyBar)
  
  smelter.breakBar = g.rectangle(60, 20, '#f00', 0, xPos + 10, 480)
  layer2.addChild(smelter.breakBar)
  smelter.breakBar.visible = false


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
    repairText.content = `Repair Cost = ${stats.repairCost}`

    smelter.health = smelter.baseHealth
    healthText.content = `Health: ${smelter.health}`
    smelter.breakBar.visible = false
    smelter.readyBar.visible = true
    smelter.ready = true
    smelter.running = false
  }

  
  space = g.rectangle(70, 400, '#777', 2, xPos + 5, 115)
  space.xOrigin = space.x
  space.yOrigin = space.y
  space.visible = false
  uiLayer.addChild(space)
  // layer2.addChild(space)


  const packaging = g.rectangle(100, 50, '#333', 1, 180, 0)
  layer2.addChild(packaging)




  for (let i = 0; i <= beltSize; i++) {
    addElement(10 + (25 * (beltSize - i)))
  }


}