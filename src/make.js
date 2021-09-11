import { g } from "./main.js"
import { data, LS, stats, statsKey } from "./Setup/loadSavedData.js"
import { repairButton } from "./Setup/initButtons.js"
import { bCapacity, machine, space } from "./Setup/initEquipments.js"
import { cashText, operationNum, repairNum, totalNum, valueNum } from "./Setup/initLeftDisplays.js"

const processTime = 100

export let toBeProcessed = []
let currentProcessTime
let spaceValue
let operationCost
let materials
let healthDifference
let total
let materialsSet = []

export function startProcessing() {
  valueNum.content = 0
  operationNum.content = 0
  totalNum.content = 0
  currentProcessTime = 0
  machine.readyBar.visible = false
  machineProcess()

  spaceValue = 0
  materialsSet.length = 0
  toBeProcessed.forEach(e => {
    if (materialsSet.findIndex(u => u.content == e.content) == -1) materialsSet.push(e)
  })
  
  materials = materialsSet.length
  operationCost = (materials * 50) + (0 | 2 ** (materials))

  toBeProcessed.forEach(p => {
    spaceValue += p.value
    machine.health -= p.damage
    stats.repairCost += p.damage * 10
    g.remove(p)
  })

  healthDifference = machine.baseHealth - machine.health
  toBeProcessed.length = 0
}

function machineProcess() {
  if (currentProcessTime < processTime) {
    currentProcessTime += 1
    machine.bar.width = (currentProcessTime / processTime) * 60
    g.wait(5, () => machineProcess())
  } else {
    leftAmount = 0
    upAmount = 0
    space.visible = true
    repairNum.content = stats.repairCost

    if (machine.health <= 0) {
      machine.healthBar.height = machine.baseHealth
      repairButton.visible = true
      machine.break()
    } else {
      machine.healthBar.height = healthDifference
      machine.running = false
      machine.readyBar.visible = true
    }

    eject()
    bCapacity.height = 300
    machine.capacity.f = machine.capacity.originalF
  }
}

const leftSteps = 110
const upSteps = 500
let leftAmount, upAmount

function eject() {
  if (leftAmount < leftSteps) {
    leftAmount += 5
    space.x -= 5
    g.wait(1, eject)
  } else {
    total = spaceValue - operationCost
    valueNum.content = spaceValue
    operationNum.content = operationCost
    totalNum.content = total
    stats.currentCash += total

    data.currentCash = stats.currentCash
    data.repairCost = stats.repairCost
    data.machineHealth = machine.health

    LS[statsKey] = JSON.stringify(data)

    changeValue()
    g.wait(1500, moveUp)
  }
}

function moveUp() {
  if (upAmount < upSteps) {
    upAmount += 7
    space.y -= 7
    g.wait(1, moveUp)
  } else {
    space.visible = false
    space.x = space.xOrigin
    space.y = space.yOrigin
  }
}

let diff 
export function changeValue() {
  diff = stats.displayedCash - stats.currentCash
  if (diff < 0) {
    if (Math.abs(diff) > 8) stats.displayedCash += 9
    else stats.displayedCash += 1
  } else if (diff > 0) {
    if (Math.abs(diff) > 8) stats.displayedCash -= 9
    else stats.displayedCash -= 1
  }
  cashText.content = `${stats.displayedCash}`
  if (diff) g.wait(1, changeValue)
}
