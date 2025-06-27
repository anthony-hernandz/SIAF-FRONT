<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed, onMounted, ref } from 'vue'
import AppButtonComponent from '@/components/AppButtonComponent.vue'
import AppInputTextComponent from '@/components/AppInputTextComponent.vue'
import usePasswordChange from '@/modules/auth/composables/usePasswordChange.js'
import { useRoute } from 'vue-router'

const {
  passwordForm,
  recoveryPassword,
  newPasswordErrors,
  confirmPasswordErrors,
  goToRestorePassword,
  comprobarToken,
} = usePasswordChange()

const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())

const route = useRoute()
const token = computed(() => route.query.token || '')

onMounted(async () => {
  comprobarToken({ tokenNombre: token.value })
});

</script>
<template>
  <v-main class="bg-backgroundSection">
    <v-row justify="center" style="height: 100% !important" :class="display.xs || display.sm ? 'resetCSS_':''">
      <v-col cols="12" sm="12" md="12" lg="4" xl="4" align-self="center">
        <div class="bg-backgroundLay main-card" style="padding-top: 25px; padding-bottom: 25px">
          <div class="mb-10">
            <v-img
              style="margin: 14px auto"
              max-height="275"
              max-width="275"
              src="@/assets/img/LogoSIAF.png"
            ></v-img>
          </div>
          <v-card color="backgroundSection" class="pa-2 pa-sm-10 ma-10 card-login" :class="display.lg || display.xl ? 'normal-card-width':'small-card-width'" :elevation="1">
            <div class="pa-8">
              <h2 class="text-primaryBackground text-center">Ingresa tu nueva contraseña</h2>
              <p class="text-comonT text-center">
                Se recomienda que contenga al menos 8 dígitos, usando letras, mayúsculas,
                minúsculas, número y caracteres especiales.
              </p>
            </div>
            <v-form @submit.prevent="recoveryPassword">
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
                          @btnAction="goToRestorePassword"
                        />
                      </v-col>
                      <v-col cols="12" lg="5" class="text-center">
                        <app-button-component
                          title="Guardar"
                          colors="primaryBackground"
                          :isBlockSize="true"
                          @btnAction="recoveryPassword(token)"
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

.card-login {
  position: relative !important;

  margin: auto !important;
  border-radius: 10px;
}

.normal-card-width {
  width: 85%;
}

.small-card-width {
  width: 95%;
}

.main-card {
  border-radius: 12px;
  padding: 10px;
  margin: 10px auto;
  max-width: 700px;
}
</style>
