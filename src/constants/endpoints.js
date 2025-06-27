export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/v1/auth/login',
    LOGOUT: '/api/v1/auth/logout',
    GET_USER: '/api/v1/auth/account',
    GET_PERMISSIONS: '/api/v1/admin/usuarios/permissions',
    REFRESH_TOKEN: '/api/v1/auth/refresh-token',
    RECOVER_PASSWORD: '/api/v1/auth/recover-password',
    RESET_PASSWORD: '/api/v1/auth/reset-password',
    CHANGE_PASSWORD_RESET: '/api/v1/auth/change-password-reset',
    CHANGE_PASSWORD_RESET_BY_USER: '/api/v1/auth/change-password-reset-by-user',
    REQUEST_OTP: '/api/v1/auth/request-otp',
    VERIFY_OTP: '/api/v1/auth/verify-otp',
    RESEND_OTP: '/api/v1/auth/resend-otp',
    EXPIRE_OTP: '/api/v1/auth/expire-otp'
  },
  ROLES: {
    BASE: '/api/v1/admin/roles',
    GET_ROLE: (id) => `/api/v1/admin/roles/${id}`,
    UPDATE_ROLE: (id) => `/api/v1/admin/roles/${id}`,
    DELETE_ROLE: (id, idState) => `/api/v1/admin/roles/${id}/estado/${idState}`,
    PERMISSIONS: (id) => `/api/v1/admin/roles/permisos-modulos/${id}`
  },
  USERS: {
    BASE: '/api/v1/admin/usuarios',
    GET_USER: (id) => `/api/v1/admin/usuarios/${id}`,
    UPDATE_USER: (id) => `/api/v1/admin/usuarios/${id}`,
    DELETE_USER: (id) => `/api/v1/admin/usuarios/${id}`
  },
  MENU: {
    GET: '/api/v1/menu'
  }
}
