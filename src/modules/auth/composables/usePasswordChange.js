import { ref, computed } from 'vue'
import useVuelidate from '@vuelidate/core'
import { helpers, required, sameAs, minLength, maxLength } from '@vuelidate/validators'
import useUtilsStore from '@/store/utils'
import router from '@/router/index.js'
import useAuthStore from '@/store/auth'

const goToRestorePassword = () => {
  router.push({ name: 'send-mail-password' })
}

const goToLogin = async () => {
  await router.push({ name: 'login' })
}

const usePasswordChange = () => {
  const { showLoader, hideLoader } = useUtilsStore()
  const { resetUserPassword, changePasswordAfterReset, user, changePasswordAfterResetByUser } = useAuthStore()

  const passwordForm = ref({
    newPassword: '',
    confirmPassword: ''
  })

  const passwordValidation = helpers.withMessage(
    'La contraseña debe tener entre 8 a 20 caracteres y contener números, letras y caracteres especiales',
    (value) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(value)
  )

  const passwordRules = computed(() => ({
    newPassword: {
      required: helpers.withMessage('La nueva contraseña es requerida', required),
      minLength: helpers.withMessage('La contraseña debe tener al menos 8 caracteres', minLength(8)),
      maxLength: helpers.withMessage('La contraseña no debe exceder los 20 caracteres', maxLength(20)),
      passwordValidation
    },
    confirmPassword: {
      required: helpers.withMessage('Debe confirmar la nueva contraseña', required),
      sameAs: helpers.withMessage('Las contraseñas deben coincidir', sameAs(computed(() => passwordForm.value.newPassword)))
    }
  }))

  const vPassword$ = useVuelidate(passwordRules, passwordForm)

  const newPasswordErrors = computed(() => vPassword$.value.newPassword.$errors.map((error) => error.$message))
  const confirmPasswordErrors = computed(() => vPassword$.value.confirmPassword.$errors.map((error) => error.$message))

  const recoveryPassword = async (token) => {
    try {
      await vPassword$.value.$validate()
      if (vPassword$.value.$error) return
      await changePasswordAfterReset({ newPassword: passwordForm.value.newPassword,
        repeatPassword: passwordForm.value.confirmPassword,
        tokenReset: token,
      })
      await goToLogin()
      showLoader()
    } catch (error) {
      console.error(error)
    } finally {
      hideLoader()
    }
  }

  const recoveryPasswordByUser = async (token) => {
    try {
      await vPassword$.value.$validate()
      if (vPassword$.value.$error) return
      await changePasswordAfterResetByUser({ newPassword: passwordForm.value.newPassword,
        repeatPassword: passwordForm.value.confirmPassword,
        user,
      })
      showLoader()
    } catch (error) {
      console.error(error)
    } finally {
      hideLoader()
    }
  }
  const comprobarToken = async (token) => {
    const response = await resetUserPassword(token)
  }

  return {
    passwordForm,
    recoveryPassword,
    recoveryPasswordByUser,
    vPassword$,
    newPasswordErrors,
    confirmPasswordErrors,
    goToRestorePassword,
    comprobarToken
  }
}

export default usePasswordChange
