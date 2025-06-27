<script setup>
import useAuth from '../composables/useAuth'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import {ref,onMounted } from 'vue'

import AppLoaderComponent from '@/components/AppLoaderComponent.vue'
import AppButtonComponent from '@/components/AppButtonComponent.vue'
import AppTextSignComponent from '@/components/AppTextSignComponent.vue'

const { form,
        goToRestorePassword, loginSubmit,
        emailErrors, passwordErrors } = useAuth()

const { xs } = useDisplay()
const display = ref(useDisplay())

onMounted(() => {

})

</script>

<template>
  <app-loader-component />
    <v-row class="bg-backgroundSection" style="height: 100% !important; " :class="display.xs || display.sm ? 'resetCSS_':''" >
      <v-col cols="12" sm="12" md="12" lg="7" xl="7" v-if="display.lg || display.xl" >
       <div class="inicioBackground"></div>
      </v-col>
      <v-col  cols="12" sm="12" md="12" lg="5" xl="5" align-self="center">
        <div class="bg-backgroundLay login-card" style="padding-top: 25px;padding-bottom: 25px;">
          <div class="mb-10">
            <v-img style="margin: 14px auto" max-height="275" max-width="300" src="@/assets/img/LogoSIAF.png"
            ></v-img>
          </div>
          <v-card color="backgroundSection" class="pa-2 pa-sm-10 ma-10 card-login" :class="display.lg || display.xl ? 'normal-card-width':'small-card-width'" :elevation="1">
           <div>
            <h2 class="text-primaryBackground text-center">Inicia sesión</h2>
           </div>
            <v-form @submit.prevent="loginSubmit">
              <v-card-text>
                <v-row class="pa-0" justify="center">
                  <v-col cols="12">
                    <app-text-sign-component
                      v-model="form.email"
                      label="Nombre de usuario"
                      icon="mdi-account"
                      :error-messages="emailErrors"
                    />
                  </v-col>
                  <v-col cols="12">
                    <app-text-sign-component
                      v-model="form.password"
                      label="Contraseña"
                      icon="mdi-lock"
                      :isPassword="true"
                      :error-messages="passwordErrors"
                    />
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center align-center">
                    <app-button-component
                      title="Ingresar"
                      colors="primaryBackground"
                      class=" rounded-xl"
                      :width-size="display.xs || display.sm ? '200px' : '390px'"
                      :style="xs ? { marginBottom: '10px' } : { marginBottom: '0px' }"
                      @btnAction="loginSubmit"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
          </v-form>
        </v-card>
        <div class="text-center mb-12 mt-4">
          <v-btn variant="text" rounded @click="goToRestorePassword()">
            <span class="text-primaryBackground" style="text-decoration: underline;">Recupera tu contraseña</span>
          </v-btn>
        </div>
      </div>
      </v-col>
    </v-row>
</template>

<style scoped>

.card-login {
  position: relative !important;
  margin: auto !important;
  border-radius: 30px;
}

.normal-card-width{
  width: 70%;
}

.small-card-width{
  width: 90%;
}

.login-card {
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin: 10px auto;
  max-width: 700px;
}

.inicioBackground {
  height: 100% !important;
  background-image: url('@/assets/img/InicioSesion.svg') !important;
  background-size: cover;
  background-repeat: no-repeat;
}

</style>
