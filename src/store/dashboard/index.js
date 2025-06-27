import { defineStore } from 'pinia'
import { dashboardServices } from '@/services'

const getNavItem = (items) => {
  return items.filter((item) => {
    if (item?.children?.length === 0) {
      delete item.children
    }
    return true
  })
}

const useDashboardStore = defineStore('dashboard', {
  state: () => ({
    menu: [],
    routes: [],
    establecimientoArray: [],
  }),
  persist: true,
  actions: {
    async getRoutes() {
      const response = await dashboardServices.getMenu()
      if (response.status === 200) {
        this.routes = response.data
        this.menu = getNavItem(response.data)
      }
    },
    async obtenerEstablecimientos() {
      const response = await dashboardServices.getEstablecimientos()
      if (response.status == 200) {
        this.establecimientoArray = response.data.establecimientos;
        return this.establecimientoArray;
      }
    }
  }
})

export default useDashboardStore
