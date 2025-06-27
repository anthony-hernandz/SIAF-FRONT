import dayjs from 'dayjs'
import router from '@/router'
import useAuthStore from '@/store/auth'

const useUtils = () => {
  const verificarPermisosFtn = (...permisosRuta) => {
    const { permisos, perfiles } = useAuthStore()

    if (permisos?.length === 0) return false

    const isSuperAdmin = perfiles.find((perfil) => perfil.acronimo === 'SUPER_ADMIN')
    if (isSuperAdmin) return true

    return permisosRuta.some((permisoRuta) =>
      permisos.find((permiso) => permiso.nombre === permisoRuta)
    )
  }

  const verificarPermisoFtn = (permiso) => {
    const { permisos, perfiles } = useAuthStore()

    if (permisos?.length === 0) return false

    const isSuperAdmin = perfiles.find((perfil) => perfil.acronimo === 'SUPER_ADMIN')
    if (isSuperAdmin) return true

    return permisos.find((permisoUsuario) => permisoUsuario.nombre === permiso)
  }

  const formatCurrencyFtn = (value, symbol = true) => {
    return Intl.NumberFormat('en-US', {
      style: symbol ? 'currency' : 'decimal',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const verifyDuiFtn = (value) => {
    if (value === null) return false
    let valido = false

    if (value.length === 10) {
      if (value !== '00000000-0') {
        let [digitos, validador] = value.split('-')
        if (typeof digitos !== 'undefined' && typeof validador !== 'undefined') {
          if (validador.length === 1) {
            digitos = digitos.split('')

            validador = parseInt(validador, 10)
            digitos = digitos.map((digito) => parseInt(digito, 10))
            let suma = digitos.reduce((total, digito, index) => (total += digito * (9 - index)), 0)

            let mod = suma % 10
            mod = validador === 0 && mod === 0 ? 10 : mod

            let resta = 10 - mod

            if (resta === validador) {
              valido = true
            }
          }
        }
      }
    }
    return valido
  }

  const verifyNitFtn = (value) => {
    if (!value || value.length !== 17 || value === '0000-000000-000-0') {
      return false
    }

    if (!value.match(/^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$/)) {
      return false
    }

    const [ubicacion, fecha, correlativo, validador] = value.split('-')
    const digitos = (ubicacion + fecha + correlativo).split('').map(Number)

    let suma = 0
    let mod = 0

    if (parseInt(correlativo, 10) <= 100) {
      suma = digitos.reduce((total, digito, index) => total + digito * (14 - index), 0)
      mod = suma % 11
      mod = mod === 10 ? 0 : mod
    } else {
      suma = digitos.reduce(
        (total, digito, index) =>
          total + digito * (3 + 6 * Math.floor((index + 5) / 6) - (index + 1)),
        0
      )
      mod = suma % 11
      mod = mod > 1 ? 11 - mod : 0
    }

    return mod === parseInt(validador, 10)
  }

  const dateFormatFtn = (value) => {
    if (value) {
      return dayjs(value).format('DD/MM/YYYY')
    } else return dayjs().format('DD/MM/YYYY')
  }

  const dateTimeFormatFtn = (value, formatString = 'DD/MM/YYYY HH:mm:ss') => {
    if (value) {
      return dayjs(value).format(formatString)
    } else return dayjs().format(formatString)
  }

  const canNext = async (to) => {
    const permisosRuta = to?.meta?.canAccess
    const acceso = verificarPermisosFtn(...permisosRuta)
    return acceso
  }

  const redirectTo = (name, params = {}) => {
    router.push({ name, params })
  }

  return {
    verificarPermisosFtn,
    verificarPermisoFtn,
    formatCurrencyFtn,
    verifyDuiFtn,
    verifyNitFtn,
    dateFormatFtn,
    dateTimeFormatFtn,
    canNext,
    redirectTo
  }
}

export default useUtils
