import { ref, computed, onMounted } from 'vue'
import useVuelidate from '@vuelidate/core'
import { email, helpers, required, sameAs, minLength, maxLength } from '@vuelidate/validators'
import useUtilsStore from '@/store/utils'
import router from '@/router/index.js'
import useAuthStore from '@/store/auth'


const goToRestablishPassword = () => {
  router.push({ name: 'restablish-password' })
}

const goToLogin = async () => {
  await router.push({ name: 'login' })
}

const usePasswordRecovery = () => {
  const { showLoader, hideLoader } = useUtilsStore()
  const { requestPasswordRecovery } = useAuthStore()
  const timer = ref(60)
  const canResendCode = ref(false)
  let countdownInterval = null

  const resetForm = ref({ email: '' })

  const emailDomain = helpers.withMessage(
    'El correo debe ser del dominio @salud.gob.sv',
    (value) => value && /@salud\.gob\.sv$/.test(value)
  )

  const acabado = ref(false)
  const enviado = ref(false)

  const startCountdown = (segundos) => {
    timer.value = segundos
    canResendCode.value = false

    countdownInterval = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      } else {
        canResendCode.value = true
        clearInterval(countdownInterval)
        acabado.value = true
        enviado.value = false
      }
    }, 1000)
  }

  const resetRules = computed(() => ({
    email: {
      required: helpers.withMessage('El correo electrónico es requerido', required),
      email: helpers.withMessage('Debe ingresar un correo válido', email),
      emailDomain
    }
  }))

  const vReset$ = useVuelidate(resetRules, resetForm)

  const resetEmailErrors = computed(() => vReset$.value.email.$errors.map((error) => error.$message))

  const time = computed(() => {
    const minutes = Math.floor(timer.value / 60)
    const seconds = timer.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  const sendResetEmail = async () => {
    try {
      await vReset$.value.$validate()
      if (vReset$.value.$error) return
      const response = await requestPasswordRecovery({ email: resetForm.value.email })
      const segundos = response.segundos
      enviado.value = true
      acabado.value = false
      startCountdown(segundos)
      showLoader()
    } catch (error) {
      console.error(error)
    } finally {
      hideLoader()
    }
  }

  return {
    resetForm,
    sendResetEmail,
    vReset$,
    resetEmailErrors,
    goToLogin,
    time,
    enviado,
    acabado
  }
}

export default usePasswordRecovery
