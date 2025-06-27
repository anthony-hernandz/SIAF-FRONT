import network from '@/utils/useConfigApi'
import { ENDPOINTS } from '@/constants/endpoints'

const login = async (data) => await network.post(ENDPOINTS.AUTH.LOGIN, data)
const logout = async (data) => await network.post(ENDPOINTS.AUTH.LOGOUT, data)
const getUser = async () => await network.get(ENDPOINTS.AUTH.GET_USER)
const getPermissions = async (data) => await network.get(ENDPOINTS.AUTH.GET_PERMISSIONS + '/' + data)
const refreshToken = async (data) => await network.post(ENDPOINTS.AUTH.REFRESH_TOKEN, data)
const recoverPassword = async (data) => await network.post(ENDPOINTS.AUTH.RECOVER_PASSWORD, data)
const resetPassword = async (data) => await network.post(ENDPOINTS.AUTH.RESET_PASSWORD, data)
const changePasswordResetByUser = async (data) => await network.post(ENDPOINTS.AUTH.CHANGE_PASSWORD_RESET_BY_USER, data)
const changePasswordReset = async (data) => await network.post(ENDPOINTS.AUTH.CHANGE_PASSWORD_RESET, data)
const enable2FA = async (data) => await network.post(ENDPOINTS.AUTH.ENABLE_2FA, data)
const disable2FA = async (data) => await network.post(ENDPOINTS.AUTH.DISABLE_2FA, data)
const verify2FA = async (data) => await network.post(ENDPOINTS.AUTH.VERIFY_OTP, data)

export {
  login,
  logout,
  getUser,
  getPermissions,
  refreshToken,
  recoverPassword,
  resetPassword,
  changePasswordResetByUser,
  changePasswordReset,
  enable2FA,
  disable2FA,
  verify2FA
}

