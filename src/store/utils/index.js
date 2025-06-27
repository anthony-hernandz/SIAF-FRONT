import { defineStore } from 'pinia'

const useUtilsStore = defineStore('utils', {
  state: () => ({
    loader: false
  }),
  actions: {
    showLoader() {
      this.loader = true
    },
    hideLoader() {
      this.loader = false
    }
  }
})

export default useUtilsStore
