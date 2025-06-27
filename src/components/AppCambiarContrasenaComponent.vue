<script setup>
import { ref } from 'vue'

import AppTitleComponent from './AppTitleComponent.vue';
import AppInputTextComponent from './AppInputTextComponent.vue';
import usePasswordChange from '@/modules/auth/composables/usePasswordChange';
import { useDisplay } from 'vuetify/lib/framework.mjs';

const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}

const {
  passwordForm,
  recoveryPasswordByUser,
  newPasswordErrors,
  confirmPasswordErrors,
} = usePasswordChange()

const display = ref(useDisplay())
const aceptar = async () => {
  close();
  await recoveryPasswordByUser()
}
</script>
<template>
<div>
  <v-col cols="12" sm="12" md="12" lg="12" xl="12" align-self="center">
    <div class="bg-backgroundLay main-card" style="padding-top: 5px; padding-bottom: 5px">
      <div class="mb-10">
        <v-img
          style="margin: 14px auto"
          max-height="275"
          max-width="275"
          src="@/assets/img/LogoSIAF.png"
        ></v-img>
      </div>
      <v-card color="backgroundSection" class="pa-2 pa-sm-10 ma-8 card-login" :class="display.lg || display.xl ? 'normal-card-width':'small-card-width'" :elevation="1">
        <div class="pa-2">
          <h2 class="text-primaryBackground text-center">Ingresa tu nueva contraseña</h2>
          <p class="text-comonT text-center">
            Se recomienda que contenga al menos 8 dígitos, usando letras, mayúsculas,
            minúsculas, número y caracteres especiales.
          </p>
        </div>
        <v-form @submit.prevent="aceptar">
          <v-card-text>
            <v-row class="pa-0" justify="center">
              <v-col cols="12">
                <app-input-text-component
                  v-model="passwordForm.newPassword"
                  label="Ingrese su nueva contraseña"
                  :isPassword="true"
                  :error-messages="newPasswordErrors"
                />
              </v-col>
              <v-col cols="12">
                <app-input-text-component
                  v-model="passwordForm.confirmPassword"
                  label="Repita su nueva contraseña"
                  :isPassword="true"
                  :error-messages="confirmPasswordErrors"
                />
              </v-col>
              <v-col cols="12">
                <v-row justify="center" justify-lg="space-around" class="pb-5">
                  <v-col cols="12" lg="5" class="text-center">
                    <app-button-component
                      title="Cancelar"
                      colors="primaryBackground"
                      :outlined="true"
                      :isBlockSize="true"
                      @btnAction="close"
                    />
                  </v-col>
                  <v-col cols="12" lg="5" class="text-center">
                    <app-button-component
                      title="Guardar"
                      colors="primaryBackground"
                      :isBlockSize="true"
                      @btnAction="aceptar"
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
</div>
</template>
