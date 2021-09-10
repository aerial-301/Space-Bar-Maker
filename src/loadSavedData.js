import { stats, statsKey } from "./main.js"

export let data

export function loadSavedData() {
  data = localStorage[statsKey]
  if (data) {
    data = JSON.parse(localStorage[statsKey])
    stats.currentCash = data.currentCash
    stats.displayedCash = data.currentCash
    stats.repairCost = data.repairCost
    stats.machineHealth = data.machineHealth
  } else {
    stats.currentCash = 1000
    stats.repairCost = 0
    stats.machineHealth = 300
    data = {...stats}
    stats.displayedCash = stats.currentCash
  }
}
