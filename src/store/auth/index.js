import {
  login,
  logout,
  getUser,
  getPermissions,
  refreshToken,
  recoverPassword,
  resetPassword,
  changePasswordReset,
  changePasswordResetByUser,
  enable2FA,
  disable2FA,
  verify2FA
} from '@/services/auth.services'

import { defineStore } from 'pinia'
import router from '@/router'
import useToastAlert from '@/utils/useToastAlert'

const { showToastAlert } = useToastAlert()

const useAuthStore = defineStore('auth', {
  state: () => ({
    user: {},
    perfiles: [],
    permisos: [],
    token: '',
    refreshToken: '',
    is2FAEnabled: false,
    establecimiento: null
  }),
  persist: true,
  actions: {
    async fetchUser() {
      try {
        const response = await getUser()
        if (response?.status === 200) {
          const { data } = response
          this.user = {
            username: data.username,
            email: data.email
          }
          this.profiles = [...data.profiles]
        }
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    },

    async fetchPermissions(id) {
      try {
        const response = await getPermissions(id)
        if (response?.status === 200) {
          this.permisos = [...response.data.permisos]
        }
      } catch (error) {
        console.error("Error fetching permissions:", error)
      }
    },

    setTokens(token, refreshToken) {
      this.token = token
      this.refreshToken = refreshToken
    },

    async authenticate(credentials) {
      try {
        const response = await login(credentials)
        if (response?.status === 200) {
          const { data } = response
          return { logged: data.logged };
        }
      } catch (error) {
        console.error("Login error:", error);
      }
      return { logged: false };
    },

    async completeAuthentication() {
      this.setTokens(data.token, data.refresh_token)
      await this.fetchUser()
      await this.fetchPermissions()
      showToastAlert('Welcome!', 'success').then(() => {
        router.push({ name: 'dashboard' })
      })
    },

    async refreshAuthToken() {
      try {
        const response = await refreshToken({ refresh_token: this.refreshToken })
        if (response?.status === 200) {
          this.setTokens(response.data.token, response.data.refresh_token)
        }
      } catch (error) {
        console.error("Error refreshing token:", error)
      }
    },

    async requestPasswordRecovery(email) {
      try {
        const response = await recoverPassword(email)
        if (response.status == 200) {
          return response.data
        } else {
          return false
        }

      } catch (error) {
        console.error("Error in password recovery:", error)
      }
    },

    async resetUserPassword(data) {
      try {
        const response = await resetPassword(data)
        if (response.data.status != undefined && !response.data.status) {
          router.push({ name: 'intentionalnotfound' })
        }

        return response.data
      } catch (error) {
        console.error("Error resetting password:", error)
      }
    },

    async changePasswordAfterReset(data) {
      try {
        await changePasswordReset(data)
        await showToastAlert('Contraseña cambiada con éxito.', 'success')
      } catch (error) {
        console.error("Error changing password:", error)
      }
    },

    async changePasswordAfterResetByUser(data) {
      try {
        await changePasswordResetByUser(data)
        await showToastAlert('Contraseña cambiada con éxito.', 'success')
      } catch (error) {
        console.error("Error changing password:", error)
      }
    },

    async enableTwoFactorAuthentication() {
      try {
        const response = await enable2FA()
        if (response?.status === 200) {
          this.is2FAEnabled = true
          await showToastAlert('Two-factor authentication enabled.', 'success')
        }
      } catch (error) {
        console.error("Error enabling 2FA:", error)
      }
    },

    async disableTwoFactorAuthentication() {
      try {
        const response = await disable2FA()
        if (response?.status === 200) {
          this.is2FAEnabled = false
          await showToastAlert('Two-factor authentication disabled.', 'info')
        }
      } catch (error) {
        console.error("Error disabling 2FA:", error)
      }
    },

    async verifyTwoFactorCode(data) {
      try {
        const response = await verify2FA(data)
        if (response.data.token != null && response.data.refreshToken != null) {
          this.setTokens(response.data.token, response.data.refreshToken)
          this.user = {
            id: response.data.user.id,
            email: response.data.user.email,
            tipo_usuario: response.data.user.tipo_usuario
          }
          this.perfiles = [
            { acronimo: response.data.user.tipo_usuario.nombre == 'Administrator' ? 'SUPER_ADMIN' : response.data.user.tipo_usuario.nombre }
          ]
          await this.fetchPermissions(this.user.id)
          return { status: true }
        } else {
          return { status: false }
        }


      } catch (error) {
        console.error("Error verifying 2FA code:", error)
        return { status: false };
      }
    },

    async signOut() {
      try {
        await logout(this.user)
      } catch (error) {
        console.error("Logout error:", error)
      } finally {
        this.clearAuthStore()
      }
    },

    clearAuthStore() {
      this.user = {}
      this.profiles = []
      this.permissions = []
      this.token = ''
      this.refreshToken = ''
      this.is2FAEnabled = false
      this.establecimiento = null
      localStorage.clear()
      router.push({ name: 'login' })
    },
    setEstablecimiento(establecimiento) {
      this.establecimiento = establecimiento
    },
  }
})

export default useAuthStore
