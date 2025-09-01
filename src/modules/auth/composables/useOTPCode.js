import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import useAuthStore from '@/store/auth'

const useOTPCode = () => {
  const otp = ref('')
  const otpLength = 6
  const errorMessage = ref('')
  const router = useRouter()
  const timer = ref(60)
  const canResendCode = ref(false)
  let countdownInterval = null
  const { verifyTwoFactorCode } = useAuthStore();

  const isOtpValid = computed(() => otp.value.length === otpLength)

  const time = computed(() => {
    const minutes = Math.floor(timer.value / 60)
    const seconds = timer.value % 60
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  })

  const startCountdown = () => {
    timer.value = 120
    canResendCode.value = false

    countdownInterval = setInterval(() => {
      if (timer.value > 0) {
        timer.value--
      } else {
        canResendCode.value = true
        clearInterval(countdownInterval)
      }
    }, 1000)
  }

  // Limpiar mensaje de error si hay un nuevo valor en `otp`
  watch(otp, (newVal) => {
    if (newVal && errorMessage.value) {
      errorMessage.value = ''
    }
  })

  const loginVerification = async (email) => {
    const response = await verifyTwoFactorCode({ email, code: otp.value });
    // Si el codigo `otp` es correcto, redirigir al dashboard
    if (response.status) {
      clearInterval(countdownInterval);
      await router.push({ name: 'dashboard' });
    } else {
      // Si el codigo `otp` es incorrecto, mostrar mensaje de error y limpiar `otp`
      errorMessage.value = 'Código ingresado incorrecto';
      otp.value = '';
      await router.replace({ name: 'email-code-verification', query: { email } });
    }
  };

  const resendCode = () => {
    if (canResendCode.value) {
      otp.value = ''
      errorMessage.value = ''
      startCountdown()
    }
  }

  onMounted(() => {
    startCountdown()

    window.addEventListener('beforeunload', () => {
      router.push({ name: 'login' })
    })
  })

  return {
    otp,
    loginVerification,
    errorMessage,
    time,
    canResendCode,
    resendCode,
    isOtpValid
  }
}

export default useOTPCode
