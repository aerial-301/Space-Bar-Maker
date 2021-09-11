import { g } from "../main.js"
import { repairButton } from "./initButtons.js"
import { mainLayer, uiLayerBG, uiLayerText } from "./initLayers.js"
import { stats } from "./loadSavedData.js"

export let cashText
export let board
export let valueText
export let materialsText
export let operationText
export let totalText
export let valueNum
export let operationNum
export let totalNum
export let repairNum
export let repairText
export let healthText

export function initLeftDisplays() {

  g.makeText(mainLayer, '💰', 20, 0, 10, 10)
  cashText = g.makeText(mainLayer, stats.displayedCash, 20, '#FFF', 34, 11)

  const frame = g.rectangle(170, 120, '#000', 1, 2, 190)
  uiLayerBG.addChild(frame)
  const bottomLine = g.rectangle(150, 2, '#fff', 0, 8, 270)
  uiLayerText.addChild(bottomLine)
  valueText = g.makeText(uiLayerText, 'Value', 18, '#ddd', 8, 198)
  operationText = g.makeText(uiLayerText, 'Operation', 18, '#ddd', 8, valueText.y + 30)
  totalText = g.makeText(uiLayerText, 'Total', 18, '#ddd', 8, 282)
  valueNum = g.makeText(uiLayerText, '0', 16, '#0e0', 114, 200)
  operationNum = g.makeText(uiLayerText, '0', 16, '#f00', 114, valueNum.y + 30)
  totalNum = g.makeText(uiLayerText, '0', 16, '#ddd', 114, 282)
  board = g.group(
    frame,
    bottomLine,
    valueText,
    valueNum,
    operationText,
    operationNum,
    totalText,
    totalNum
  )

  const repairFrame = g.rectangle(170, 100, '#111', 1, 2, 420)
  uiLayerBG.addChild(repairFrame)
  repairText = g.makeText(uiLayerText, 'Repair Cost', 15, '#ddd', 8, 490)
  repairNum = g.makeText(uiLayerText, stats.repairCost, 16, '#d00', 110, 490)
  const repairBoard = g.group(
    repairFrame,
    repairButton,
    repairText,
    repairNum
  )
  repairBoard.y -= 80
}
