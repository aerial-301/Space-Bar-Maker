import { data } from "./loadSavedData.js"
import { g, stats, statsKey } from "./main.js"
import { repairButton } from "./initButtons.js"
import { bCapacity, smelter, space } from "./initEquipments.js"
import { cashText, operationNum, repairNum, totalNum, valueNum } from "./initLeftDisplays.js"

const productsMaxMove = 75
const smeltTime = 60

export let toBeSmelted = []
let productsMoveAmount = 0
let currentSmeltTime
let spaceValue
let operationCost
let materials
let healthDifference
let total
let materialsSet = []


export function moveToSmelter() {
  if (productsMoveAmount < productsMaxMove) {
    productsMoveAmount += 5
    toBeSmelted.forEach(p => p.x -= 5)
    g.wait(5, () => {
      moveToSmelter()
    })
  } else {
    productsMoveAmount = 0
    valueNum.content = 0
    operationNum.content = 0
    totalNum.content = 0
    startSmelting()
  }
}

export function startSmelting() {

  valueNum.content = 0
  operationNum.content = 0
  totalNum.content = 0
  currentSmeltTime = 0
  smelter.readyBar.visible = false
  
  smelt()

  spaceValue = 0
  materialsSet.length = 0

  toBeSmelted.forEach(e => {
    if (materialsSet.findIndex(u => u.content == e.content) == -1) {
      materialsSet.push(e)
    }
  })
  
  materials = materialsSet.length

  operationCost = (materials * 50) + (0 | 2 ** (materials))

  toBeSmelted.forEach(p => {
    spaceValue += p.value
    smelter.health -= p.damage
    stats.repairCost += p.damage * 10
    g.remove(p)
  })

  healthDifference = smelter.baseHealth - smelter.health

  toBeSmelted.length = 0
}

function smelt() {
  if (currentSmeltTime < smeltTime) {
    currentSmeltTime += 1
    smelter.bar.width = (currentSmeltTime / smeltTime) * 60
    g.wait(5, () => smelt())
  } else {
    leftAmount = 0
    upAmount = 0
    space.visible = true

    repairNum.content = stats.repairCost

    if (smelter.health <= 0) {
      smelter.healthBar.height = smelter.baseHealth
      repairButton.visible = true
      smelter.break()
    } else {
      smelter.healthBar.height = healthDifference
      smelter.running = false
      smelter.readyBar.visible = true
    }

    eject()
    bCapacity.height = 300
    smelter.capacity.f = smelter.capacity.originalF
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
    data.machineHealth = smelter.health

    localStorage[statsKey] = JSON.stringify(data)

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
