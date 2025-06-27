import { toast } from 'vue3-toastify'

const useToastAlert = () => {
  const showToastAlert = (message, type) => {
    const time = Number(import.meta.env.VITE_TOAST_ALERT_AUTO_CLOSE) + 500 || 5000
    return new Promise((resolve) => {
      toast(message, {
        theme: 'colored',
        type,
        autoClose: Number(import.meta.env.VITE_TOAST_ALERT_AUTO_CLOSE) || 5000,
        dangerouslyHTMLString: true
      })
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  return {
    showToastAlert
  }
}

export default useToastAlert
