import { g, main } from "../main.js"
import { startProcessing, toBeProcessed } from '../make.js'
import { elementsMoving, moveElements, insertElement, maxStackSize, mainBelt } from "../operations.js"

import { machine } from "./initEquipments.js"

const products = []
export const buttons = []
export const buttonsHeight = 580

export let repairButton
export let stackSize = 0


function buttonPress(b) {
  if(b.visible) {
    b.f = '#aaa'
    g.wait(60, () => {
      b.f = b.oColor
      g.wait(30, () => main.action = false)
    })
  }
}

export function initButtons() {

  const remove = g.simpleButton('🔻', 300, buttonsHeight + 10, 17, 37, () => {
    buttonPress(remove)
    if (!elementsMoving && !machine.pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
      g.soundEffect(320, .1, "sine", 0.06, 113, false, 0, 0)
    }
  }, 32, 80, 130, '#222')

  const push = g.simpleButton('⭡', 390, buttonsHeight - 60, 18, 24, () => {
    buttonPress(push)
    if (stackSize < 10) {
      if (elementsMoving || machine.push || machine.running || !machine.ready) return
      machine.pushed = true
      stackSize += 1
      const item = mainBelt[mainBelt.length - 1]
      if (item.isMetal) g.soundEffect(200, .08, "triangle", 0.3, 300, true)
      else g.soundEffect(130, .1, "sawtooth", 0.07, 50, false, 0, 12)
      g.removeItem(mainBelt, item)
      products.push(item)
      insertElement(item)
      moveElements()
    }
  }, 70, 80, 200)
  
  const machineProcess = g.simpleButton('>', 310, 420, 23, 10, () => {
    buttonPress(machineProcess)
    if (stackSize == maxStackSize) {
      if (machine.ready && !machine.running) {
        g.soundEffect( 80, 1.2, "sawtooth", 0.03, 30, true, 0, 10)
        machine.running = true
        products.forEach(p => toBeProcessed.push(p))
        startProcessing()
        stackSize = 0
        products.length = 0
      }
    }
  }, 20, 60, 40, '#900')


  repairButton = g.simpleButton('🔧', 10, buttonsHeight - 150, 25, 15, () => {
    if (!machine.ready) machine.fix()
    buttonPress(repairButton)
  }, 20, 80, 50)

  repairButton.visible = false
}



