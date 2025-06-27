import { ref, computed, onMounted } from 'vue'
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

  const loginVerification = async (email) => {
    const response = await verifyTwoFactorCode({ email, code: otp.value });
    if (response.status) {
      clearInterval(countdownInterval)
      await router.push({ name: 'dashboard' })
    }
  }

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
