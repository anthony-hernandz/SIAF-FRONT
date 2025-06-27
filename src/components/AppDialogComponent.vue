<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import { computed } from 'vue'
import AppButtonComponent from '@/components/AppButtonComponent.vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  title: {
    type: String,
    default: ''
  },
  textBtn: {
    type: String,
    default: 'Confirmar'
  },
  sendRequest: {
    type: Boolean,
    default: false
  },
  disabledBtnCancelar: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'confirm'])
const { smAndUp } = useDisplay()

const close = () => {
  emits('close')
}

const confirm = () => {
  emits('confirm')
}

const showDialog = computed(() => {
  return props.show
})
</script>

<template>
  <v-dialog v-model="showDialog" max-width="900" persistent>
    <v-card class="pa-4 border-rounded">
      <v-row>
        <v-col class="d-flex justify-end" cols="12"> </v-col>
      </v-row>
      <v-card-title class="d-flex justify-space-between align-center">
        <span></span>
        <span
          :class="smAndUp ? 'text-h4' : 'text-h5'"
          style="word-break: keep-all; text-align: center; color: #1c1e4d; font-weight: bold"
        >
          {{ title }}
        </span>
        <v-icon @click="close">mdi-window-close</v-icon>
      </v-card-title>
      <v-card-text class="mt-5">
        <slot name="body"></slot>
      </v-card-text>
      <v-card-actions class="d-flex justify-center">
        <app-button-component
          title="Cancelar"
          :outlined="true"
          colors="primary"
          @btnAction="close"
          :disabled="props.disabledBtnCancelar"
        />
        <app-button-component
          class="ml-4"
          :title="textBtn"
          colors="primary"
          :send-request="props.sendRequest"
          @btnAction="confirm"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.border-rounded {
  border-radius: 15px !important;
}
</style>
