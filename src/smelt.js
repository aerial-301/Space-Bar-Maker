import { smelter, space } from "./initEquipments.js"
import { cashText, stats, g, valueText, healthText, operationText, totalText, repairText, materialsText, repairButton, valueNum, operationNum, totalNum, repairNum } from "./main.js"

export let toBeSmelted = []
const productsMaxMove = 75
let productsMoveAmount = 0
let smeltTime, currentSmeltTime, spaceValue

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

function startSmelting() {

  smeltTime = g.randomNum(150, 400)
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

  

  operationCost = (materials * 10) + 2 ** (materials / 3) | 0
  // operationCost = Math.exp() materials * 10

  
  toBeSmelted.forEach(p => {
    spaceValue += p.value
    smelter.health -= p.damage
    stats.repairCost += p.damage * 10
    g.remove(p)
  })

  healthDifference = smelter.baseHealth - smelter.health

  // stats.repairCost += healthDifference * 10



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

    total = spaceValue - operationCost

    valueNum.content = spaceValue
    // materialsText.content = `Materials = ${materials}`
    operationNum.content = operationCost

    totalNum.content = total

    repairNum.content = stats.repairCost

    
    
    // healthText.content = `Health: ${smelter.health}`
    // const healthGap = smelter.baseHealth - smelter.health
    
    if (smelter.health <= 0) {
      smelter.healthBar.height = smelter.baseHealth
      repairButton.visible = true
      smelter.break()
    } else {
      smelter.healthBar.height = healthDifference
      g.wait(1000, () => {
        smelter.readyBar.visible = true
        smelter.running = false
      })
    }



    eject()
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
    // console.log(leftAmount, space.x)

    // stats.currentCash += stats.displayedCash + spaceValue
    stats.currentCash += total

    changeValue()

    g.wait(500, moveUp)
    
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
    // space.x = 305
    // space.y = 115
  }
}


let diff 
export function changeValue() {
  diff = stats.displayedCash - stats.currentCash
  // if (stats.displayedCash != stats.currentCash) {
  // if (diff) {
  if (diff < 0) {
  // if (stats.displayedCash < stats.currentCash) {
    if (Math.abs(diff) > 8) stats.displayedCash += 9
    else stats.displayedCash += 1
  } else if (diff > 0) {
    if (Math.abs(diff) > 8) stats.displayedCash -= 9
    else stats.displayedCash -= 1
  }

  cashText.content = `${stats.displayedCash}`
  console.log('run')
  if (diff) g.wait(1, changeValue)
}
// }

