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
      email: helpers.withMessage('El usuario no es válido', email)
    },
    password: {
      required: helpers.withMessage('La contraseña es requerida', required)
    }
  }))

  const v$ = useVuelidate(rules, form)

  const emailErrors = computed(() => v$.value.email.$errors.map((error) => error.$message))
  const passwordErrors = computed(() => v$.value.password.$errors.map((error) => error.$message))

  const togglePassword = () => {
    showPassword.value = !showPassword.value
  }

  const loginSubmit = async () => {
    try {
      showLoader()
      await v$.value.$validate()

      if (v$.value.$error) {
        hideLoader()
        return
      }

      const response = await authenticate(form.value)

      if (response.logged) {
        goToOTPCode(form.value.email)
      } else {
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
