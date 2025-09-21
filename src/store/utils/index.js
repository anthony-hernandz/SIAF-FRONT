import { defineStore } from 'pinia'

const useUtilsStore = defineStore('utils', {
  state: () => ({
    loader: false,
    show: false,
    message: '',
    error: false,
  }),
  actions: {
    showLoader() {
      this.loader = true
    },
    hideLoader() {
      this.loader = false
    },
    showSuccess(msg) {
      this.message = msg
      this.error = false
      this.show = true
    },
    showError(msg) {
      this.message = msg
      this.error = true
      this.show = true
    },
  }
})

export default useUtilsStore
