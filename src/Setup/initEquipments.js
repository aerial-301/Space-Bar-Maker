import { g } from "../main.js"
import { changeValue } from "../make.js"
import { data, LS, stats, statsKey } from "./loadSavedData.js"
import { repairButton } from "./initButtons.js"
import { repairNum } from "./initLeftDisplays.js"
import { mainLayer, objLayer, uiLayerBG } from "./initLayers.js"

export let machine
export let space
export let bCapacity
export function initEquipments() {
  const xPos = 300
  const yPos = 100

  machine = g.rectangle(80, 410, '#333', 2, xPos, yPos)
  machine.ready = true
  machine.running = false
  machine.pushed = false
  machine.baseHealth = 300
  machine.health = stats.machineHealth

  objLayer.addChild(machine)

  const progressBarEmpty = g.rectangle(60, 20, '#000', 0, 10, 370)
  machine.addChild(progressBarEmpty)

  machine.bar = g.rectangle(60, 20, '#ff0', 0, 10, 370)
  machine.addChild(machine.bar)

  machine.readyBar = g.rectangle(60, 20, '#0f0', 0, 10, 370)
  machine.addChild(machine.readyBar)
  
  machine.breakBar = g.rectangle(60, 20, '#f00', 0, 10, 370)
  machine.addChild(machine.breakBar)
  machine.breakBar.visible = false

  const HB = g.rectangle(8, 300, '#0f0', 2, 10, 10)
  machine.addChild(HB)

  machine.capacity = g.rectangle(8, 300, '#bb0', 2, 62, 10)
  machine.capacity.full = '#f90'
  machine.addChild(machine.capacity)

  bCapacity = g.rectangle(8, 300, '#000', 2, 62, 10)
  machine.addChild(bCapacity)

  const hbHeight = stats.machineHealth <= 0 ? 300 : machine.baseHealth - stats.machineHealth
  machine.healthBar = g.rectangle(8, hbHeight, '#000', 0, xPos + 10, yPos + 10)
  mainLayer.addChild(machine.healthBar)

  machine.break = () => {
    machine.breakBar.visible = true
    machine.ready = false
    machine.running = false
    g.soundEffect(200, .5, "square", 0.04, 60, false, 0, 50)
  }
  
  machine.fix = () => {
    stats.currentCash -= stats.repairCost
    changeValue()
    stats.repairCost = 0
    repairNum.content = 0
    machine.health = machine.baseHealth
    machine.healthBar.height = 0
    machine.breakBar.visible = false
    machine.readyBar.visible = true
    machine.ready = true
    machine.running = false
    repairButton.visible = false
    g.soundEffect( 80, .5, "triangle", 0.06, 250, true, 0, 55)

    data.repairCost = 0
    data.currentCash = stats.currentCash
    data.machineHealth = machine.baseHealth
    LS[statsKey] = JSON.stringify(data)
  }

  space = g.rectangle(70, 380, '#777', 2, xPos + 5, 105)
  space.xOrigin = space.x
  space.yOrigin = space.y
  space.visible = false
  uiLayerBG.addChild(space)

  const packaging = g.rectangle(100, 50, '#333', 1, 180, 0)
  mainLayer.addChild(packaging)

  if (machine.health <= 0) {
    repairButton.visible = true
    machine.breakBar.visible = true
    machine.ready = false
    machine.running = false
  }

}
