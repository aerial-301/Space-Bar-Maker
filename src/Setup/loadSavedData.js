export const stats = {}
export let data
export let LS = localStorage
export const statsKey = 'SBM0JS13221'
export function loadSavedData() {
    try {
      data = JSON.parse(LS[statsKey])
      if (data.currentCash != undefined) {
        stats.currentCash = data.currentCash
        stats.displayedCash = data.currentCash
        stats.repairCost = data.repairCost
        stats.machineHealth = data.machineHealth
      } else {
        setData()
      }
    } catch (error) {
      setData()
    }
}

function setData() {
  stats.currentCash = 1000
  stats.repairCost = 0
  stats.machineHealth = 300
  data = {...stats}
  stats.displayedCash = stats.currentCash
}
