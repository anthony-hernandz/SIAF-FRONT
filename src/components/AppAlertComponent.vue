<script setup>
import { computed } from 'vue';
import useUtilsStore from '@/store/utils';

const utils = useUtilsStore();

// Controla la visibilidad del snackbar
const showSnackbar = computed({
  get: () => utils.show,
  set: (val) => (utils.show = val),
});

// Color según éxito o error
const color = computed(() => (utils.error ? 'red' : 'green'));

// Icono según éxito o error
const icon = computed(() =>
  utils.error ? 'mdi-alert-circle-outline' : 'mdi-check-circle-outline'
);

// Función para cerrar manualmente
const close = () => {
  utils.show = false;
};
</script>

<template>
  <v-snackbar
    v-model="showSnackbar"
    :timeout="3000"
    :color="color"
    location="top right"
    elevation="6"
  >
    <div class="d-flex align-center justify-space-between" style="width: 100%;">
      <div class="d-flex align-center">
        <v-icon :icon="icon" class="mr-2"></v-icon>
        {{ utils.message }}
      </div>
      <v-btn icon @click="showSnackbar = false" 
      style="background: transparent; box-shadow: none;">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-snackbar>
</template>