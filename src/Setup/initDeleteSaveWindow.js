import { g } from "../main.js"
import { LS, statsKey } from "./loadSavedData.js"

let deleteSaveWindow
let isDeleteSave = false

export function initDeleteSaveWindow() {
  deleteSaveWindow = g.simpleButton('Delete save?', 100, 100, 45, 70, 0, 34, 300, 300, '#777')

  const yes = g.simpleButton('Yes', 40, 20, 4, 2, () => {
    if (isDeleteSave) {
      isDeleteSave = false
      deleteSaveWindow.visible = false
      LS.removeItem(statsKey)
      location.reload()
      return false
    }
  }, 24, 50, 30, '#F00')
  const no = g.simpleButton('No', 20, 130, 95, 50, () => {
    if (isDeleteSave) {
      deleteSaveWindow.visible = false
      isDeleteSave = false
    }
  }, 44, 260, 150, '#0c0')

  deleteSaveWindow.addChild(no)
  deleteSaveWindow.addChild(yes)
  g.stage.addChild(deleteSaveWindow)
  deleteSaveWindow.visible = false


  // Delete save button
  g.simpleButton('💾', 400, 20, 5, 10, () => {
    isDeleteSave = true
    deleteSaveWindow.visible = true
  }, 40, 60, 60, '#000')

  g.makeText(g.stage, '❌', 30, 0, 410, 40)
  
}