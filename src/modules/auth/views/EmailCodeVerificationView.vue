<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import useOTPCode from '../composables/useOTPCode'
import AppButtonComponent from '@/components/AppButtonComponent.vue'

const { otp, loginVerification, errorMessage, time, canResendCode, resendCode, isOtpValid } = useOTPCode()
const display = useDisplay()

const route = useRoute()
const email = computed(() => route.query.email || '')

const maskedEmail = computed(() => {
  if (!email.value.includes('@')) return email.value
  const [name, domain] = email.value.split('@')
  const maskedName = name.substring(0, 2) + '*'.repeat(Math.max(name.length - 2, 6))
  return `${maskedName}@${domain}`
})
</script>

<template>
  <v-main class="bg-backgroundSection">
    <v-row justify="center" style="height: 100% !important;" :class="display.xs || display.sm ? 'resetCSS_':''">
      <v-col cols="12" sm="12" md="12" lg="4" xl="4" align-self="center">
        <div class="bg-backgroundLay main-card" style="padding-top: 25px;padding-bottom: 25px;">
          <div class="mb-10">
            <v-img style="margin: 14px auto" max-height="275" max-width="275" src="@/assets/img/LogoSIAF.png"></v-img>
          </div>
          <v-card color="backgroundSection" class="pa-2 pa-sm-10 ma-10 card-main"
                  :class="display.lg || display.xl ? 'normal-card-width':'small-card-width'" :elevation="1">
            <div class="pa-8 text-center">
              <h3 class="text-primaryBackground">
                Hemos enviado un código de autenticación a tu correo:
                <strong>{{ maskedEmail }}</strong>
              </h3>
              <p class="text-primaryBackground timer-text mt-2">{{ time }}</p>
            </div>
            <v-form @submit.prevent="loginVerification(email)">
              <v-card-text>
                <v-row class="pa-0" justify="center">

                  <v-col cols="12" class="pa-0">
                    <v-otp-input
                      v-model="otp"
                      :length="6"
                      type="number"
                      variant="outlined"
                      class="otp-custom"
                      :class="{ 'error-border': errorMessage }"
                    ></v-otp-input>
                    <v-input
                      v-model="email"
                      type="hidden"
                    ></v-input>
                  </v-col>

                  <v-col cols="12" v-if="errorMessage" class="pa-0">
                    <p class="text-errorT text-center mb-6">{{ errorMessage }}</p>
                  </v-col>

                  <v-col cols="12">
                    <v-row justify="center" justify-lg="space-around" class="pb-5">
                      <v-col cols="12" lg="8" class="text-center">
                        <app-button-component
                          title="Ingresar"
                          colors="primaryBackground"
                          @btnAction="loginVerification(email)"
                          :isBlockSize="true"
                          :disabled="!isOtpValid"
                          :widthSize="display.xs || display.sm ? '90%' : '450px'"
                        />
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col cols="12" class="text-center">
                    <button
                      @click="resendCode"
                      class="resend-btn"
                      :disabled="!canResendCode"
                    >
                      Enviar un nuevo código
                    </button>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-form>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-main>
</template>
<style scoped>

  .card-main {
    position: relative !important;

    margin: auto !important;
    border-radius: 10px;
  }

  .normal-card-width {
    width: 80%;
  }

  .small-card-width{
    width: 90%;
  }

  .timer-text {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
    margin-bottom: -30px;
  }

  .resend-btn {
    border: none;
    background: none;
    color: #111E60;
    font-weight: bold;
    cursor: pointer;
  }

  .resend-btn:disabled {
    color: gray;
    cursor: not-allowed;
  }

  .main-card {
    border-radius: 12px;
    padding: 20px;
    margin: 10px auto;
    max-width: 700px;
  }

  :deep(.v-otp-input) {
    display: flex;
    justify-content: center;
    gap: 10px;
  }

  :deep(.v-otp-input__box) {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    border: 4px solid #111E60;
    font-size: 24px;
    text-align: center;
    background-color: white;
  }

  ::v-deep(.v-otp-input) {
    display: flex;
    justify-content: center;
    gap: 8px;
  }

  ::v-deep(.v-otp-input__field) {
    background-color: white !important;
    color: black !important;
    border: 1px solid #111E60 !important;
    border-radius: 5px !important;
    font-size: 20px !important;
  }

  .error-border ::v-deep(.v-otp-input__field) {
    border: 1px solid #B94A48 !important;
  }
</style>
