import { smelter } from "./initEquipments.js"
import { buttonsHeight, g, main, mainBelt, maxStackSize } from "./main.js"
import { elementsMoving, moveElements, insertElement } from "./operations.js"
import { startSmelting, toBeSmelted } from './smelt.js'

export let repairButton
export let stackSize = 0

const products = []

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
    if (!elementsMoving && !smelter.pushed) {
      mainBelt.pop().visible = false
      moveElements(0)
      g.soundEffect(320, .1, "sine", 0.06, 113, false, 0, 0)
    }
  }, 32, 80, 130, '#222')

  const push = g.simpleButton('⭡', 390, buttonsHeight - 60, 18, 24, () => {
    buttonPress(push)
    if (stackSize < 10) {
      if (elementsMoving || smelter.push || smelter.running || !smelter.ready) return
      smelter.pushed = true
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
  
  const smelt = g.simpleButton('>', 310, 420, 23, 10, () => {
    buttonPress(smelt)
    if (stackSize == maxStackSize) {
      if (smelter.ready && !smelter.running) {
        g.soundEffect( 80, 1.2, "sawtooth", 0.03, 30, true, 0, 10)
        smelter.running = true
        products.forEach(p => toBeSmelted.push(p))
        startSmelting()
        stackSize = 0
        products.length = 0
      }
    }
  }, 20, 60, 40, '#900')


  repairButton = g.simpleButton('🔧', 10, buttonsHeight - 150, 25, 15, () => {
    if (!smelter.ready) smelter.fix()
    buttonPress(repairButton)
  }, 20, 80, 50)

  repairButton.visible = false
}
