<script setup>

import { useDisplay } from 'vuetify/lib/framework.mjs'
import {ref} from 'vue'
import AppButtonComponent from '@/components/AppButtonComponent.vue'
import AppInputTextComponent from '@/components/AppInputTextComponent.vue'
import usePasswordRecovery from '../composables/usePasswordRecovery'
const { resetForm, sendResetEmail, resetEmailErrors, goToLogin, time, enviado, acabado } = usePasswordRecovery()

const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())

</script>

<template>
  <v-main class="bg-backgroundSection">
    <v-row justify="center" style="height: 100% !important; " :class="display.xs || display.sm ? 'resetCSS_':''">
      <v-col cols="12" sm="12" md="12" lg="4" xl="4" align-self="center">
        <div class="bg-backgroundLay main-card" style="padding-top: 25px;padding-bottom: 25px;">
          <div class="mb-10">
            <v-img style="margin: 14px auto" max-height="300" max-width="300" src="@/assets/img/LogoSIAF.png"
            ></v-img>
          </div>
        <v-card color="backgroundSection" class="pa-2 pa-sm-10 ma-10 card-mail" :class="display.lg || display.xl ? 'normal-card-width':'small-card-width'" :elevation="1">
         <div class="pa-8 ">
          <h2 class="text-primaryBackground text-center">Ingresa tu correo electrónico</h2>
          <p class="text-comonT text-center">Se enviará un correo electrónico con las indicaciones
            para poder establecer una nueva contraseña.
          </p>
         </div>
         <div class="text-center" v-show="enviado">
          <p class="text-center">Tiempo limite para recuperar la contraseña: </p>
          <p class="text-primaryBackground timer-text">{{ time }}</p>
         </div>
         <p class="text-center" v-show="acabado">Tiempo limite acabado, reintente</p>
          <v-form @submit.prevent="sendResetEmail">
            <v-card-text>
              <v-row class="pa-0" justify="center">
                <v-col cols="12">
                  <app-input-text-component
                    v-model="resetForm.email"
                    label="Ingresar correo electrónico..."
                    :error-messages="resetEmailErrors"
                  />
                </v-col>
                <v-col cols="12">
                    <v-row  justify="center" justify-lg="space-around" class="pb-5">
                        <v-col cols="12" lg="5" class="text-center">
                            <app-button-component
                            title="Cancelar"
                            colors="primaryBackground"
                            :outlined="true"
                            @btnAction="goToLogin"
                            :isBlockSize=true
                        />
                        </v-col>
                        <v-col cols="12" lg="5"  class="text-center">
                            <app-button-component
                            title="Enviar"
                            colors="primaryBackground"
                            @btnAction="sendResetEmail"
                             :isBlockSize=true
                            />
                        </v-col>
                    </v-row>
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

.card-mail {
  position: relative !important;
  margin: auto !important;
  border-radius: 10px;
}

.normal-card-width{
  width: 85%;
}

.small-card-width{
  width: 90%;
}

.main-card {
  border-radius: 12px;
  padding: 20px;
  margin: 10px auto;
  max-width: 700px;
}

.timer-text {
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }

</style>
