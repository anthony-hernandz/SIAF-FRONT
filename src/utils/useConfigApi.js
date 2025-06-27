import axios from 'axios'
import axiosRetry from 'axios-retry'
import useAuthStore from '@/store/auth'
import useToastAlert from '@/utils/useToastAlert'
import { ENDPOINTS } from '@/constants/endpoints'

let isRefresh = false
let requestQueue = []
const { showToastAlert } = useToastAlert()

const instance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL || 'http://10.168.241.196:3008',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

const retryCondition = (error) => {
  return error.response && error.response.status === 401 && !isRefresh
}

axiosRetry(instance, {
  retries: 1,
  retryDelay: () => (isRefresh ? 1500 : 0),
  shouldResetTimeout: true,
  retryCondition
})

instance.interceptors.request.use((config) => {
  const { token } = useAuthStore()
  if (token && config.headers !== null) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (config['0']) {
    config.headers['Content-Type'] = 'multipart/form-data'
  }

  return config
})

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const { token, clearAuthStore, refreshToken, setTokens } = useAuthStore()

    if (error.response && error.response.status === 401) {
      if (!isRefresh) {
        if (token) {
          isRefresh = true
          try {
            const response = await instance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
              refresh_token: refreshToken
            })
            if (response.data.status === 401) {
              throw new Error(response.data.error)
            }
            setTokens(response.data.token, response.data.refresh_token)

            originalRequest.headers.Authorization = `Bearer ${response.data.token}`

            const retryOriginalRequest = new Promise((resolve) => {
              resolve(instance.request(originalRequest))
            })

            requestQueue.forEach((prom) => prom.resolve(retryOriginalRequest))
            requestQueue = []

            return retryOriginalRequest
          } catch (e) {
            console.log(e)
            showToastAlert(
              'Su sesión ha expirado, por favor inicie sesión nuevamente',
              'error'
            ).then(() => {
              clearAuthStore()
            })
          } finally {
            isRefresh = false
          }
        } else {
          clearAuthStore()
        }
      } else {
        return new Promise((resolve, reject) => {
          requestQueue.push({ resolve, reject })
        }).then(() => {
          return instance(originalRequest)
        })
      }
    } else if (error.response && error.response.status === 0) {
      await showToastAlert('¡No se pudo conectar con el servidor!', 'error')
    } else if (error.response && error.response.status === 422) {
      if (Array.isArray(error.response.data.errors)) {
        for (const key in error.response.data.errors) {
          await showToastAlert(error.response.data.errors[key][0], 'error')
        }
      } else {
        await showToastAlert(error.response.data.message, 'error')
      }
    } else if (error.response && error.response.status >= 400 && error.response.status <= 500) {
      await showToastAlert(error.response.data.message, 'error')
    } else {
      await showToastAlert('¡El servidor no responde!', 'error')
    }

    return Promise.resolve(error)
  }
)

export default instance
