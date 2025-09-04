import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { email, helpers, required } from '@vuelidate/validators'
import useUtilsStore from '@/store/utils'
import useAuthStore from '@/store/auth'
import router from '@/router'

const goToRestorePassword = () => {
  router.push({ name: 'send-mail-password' })
}

const goToOTPCode = (email) => {
  router.push({ name: 'email-code-verification', query: { email } })
}

const useAuth = () => {
  const { showLoader, hideLoader } = useUtilsStore()
  const { authenticate, signOut } = useAuthStore()
  const showPassword = ref(false)

  const form = ref({
    email: '',
    password: ''
  })

  const rules = computed(() => ({
    email: {
      required: helpers.withMessage('El usuario es requerido', required),
      email: helpers.withMessage('El usuario no es válido', email),
      wrongCredentials: helpers.withMessage('Usuario no encontrado o inactivo', () => !emailLoginError.value)
    },
    password: {
      required: helpers.withMessage('La contraseña es requerida', required),
      wrongCredentials: helpers.withMessage('Contraseña incorrecta', () => !passwordLoginError.value)
    }
  }))

  const v$ = useVuelidate(rules, form)
  // Variables de error, permite que las reglas `wrongCredentials` se activen
  // y se muestren los errores personalizados según el estado del login
  const emailLoginError = ref(false)
  const passwordLoginError = ref(false)

  const emailErrors = computed(() => v$.value.email.$errors.map((error) => error.$message))
  const passwordErrors = computed(() => v$.value.password.$errors.map((error) => error.$message))

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

  const loginSubmit = async () => {
    try {
      showLoader()
      await v$.value.$validate()
      // Reinicia las variables de error antes de validar el formulario, asegurando que no se muestren errores antiguos
      emailLoginError.value = false
      passwordLoginError.value = false

      if (v$.value.$error) {
        hideLoader()
        return
      }

      const response = await authenticate(form.value)

      if (response.logged) {
        goToOTPCode(form.value.email)
      } else {
        // Activa las variables de error segun el mensaje obtenido desde el backend
        const message = response.errors

        if (message.includes("inactivo")) {
          emailLoginError.value = true
        } 
        
        if (message.includes("incorrecta")) {
          passwordLoginError.value = true
        }
        console.error('Error en la autenticación:', response.message)
      }
    } catch (error) {
      console.error('Error en el login:', error)
    } finally {
      hideLoader()
    }
  }

  const logout = async () => {
    await signOut()
  }

  return {
    form,
    showPassword,
    togglePassword,
    loginSubmit,
    v$,
    emailErrors,
    passwordErrors,
    goToRestorePassword,
    logout,
  }
}

export default useAuth
