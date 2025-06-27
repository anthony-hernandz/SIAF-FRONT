<script setup>
import {defineProps, ref, onMounted} from 'vue';
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AppButtonComponent from '@/components/AppButtonComponent.vue'
import useDashboard from '@/modules/dashboard/composables/useDashboard';
import useAuthStore from '@/store/auth';

const { xs } = useDisplay()
const { llenarEstablecimientos, establecimientos, establecimiento } = useDashboard();
const { setEstablecimiento } = useAuthStore()

const props = defineProps({
    showModal: {
    type:Boolean ,
    default:false

  },
  extraClass: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
})

const emit = defineEmits(['close'])

const submitEstablecimiento = ()=>{
  setEstablecimiento(establecimiento.value)
  emit('close')
}

onMounted(async () => {
  await llenarEstablecimientos();
});
</script>

<template>
  <div>
    <v-card>
      <v-btn
        class="close-button"
        color="primaryBackground"
        icon=""
        @click="emit('close')"
      >
        <v-icon color="white">mdi-close</v-icon>
      </v-btn>

      <div class="text-center text-textWhite pa-1">
        <v-alert
          text="Acceder a este establecimiento"
          color="primaryBackground"
        ></v-alert>
      </div>

      <v-row justify="center" class="ma-5">
        <v-col cols="11">
          <v-autocomplete label="Establecimiento"
          :items="establecimientos"
          v-model="establecimiento"></v-autocomplete>
        </v-col>
        <v-col cols="6" class="text-center">
          <app-button-component
            title="Siguiente"
            colors="primaryBackground"
            :style="xs ? { marginBottom: '20px' } : { marginBottom: '0px' }"
            @btnAction="submitEstablecimiento"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<style scoped>
.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
  border-radius: 50%;
}
</style>
