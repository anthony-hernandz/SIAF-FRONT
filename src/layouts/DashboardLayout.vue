<template>
  <v-layout class="bg-backgroundSection" ref="app">
    <app-aside-bar-component ref="asideBar" :modelValue="drawer" @CloseBar="drawer = false" />
    <v-app-bar  app :elevation="0" height="80" class="bg-backgroundSection app-bar" >
      <v-container class="d-flex align-center justify-space-between">
        <v-spacer />
        <app-bar-menu-component class="app-bar-menu" @open="open" @openCambiarContraseña="openCambiarContraseña"/>
      </v-container>
    </v-app-bar>
    <v-main >
      <v-container class="py-8 px-6" fluid>
        <router-view />
      </v-container>
    </v-main>
    <v-dialog v-model="showEstablecimientoModal" persistent max-width="500">
      <app-asignar-establecimiento @close="close"/>
    </v-dialog>
  <v-dialog v-model="showCambiarContraseña" persistent max-width="500">
    <AppCambiarContrasenaComponent @close="closeCambiarContraseña"/>
  </v-dialog>
  </v-layout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import useDashboardStore from '@/store/dashboard'
import { useDisplay } from 'vuetify/lib/framework.mjs'
import AppAsideBarComponent from '@/components/AppAsideBarComponent.vue'
import AppBarMenuComponent from '@/components/AppBarMenuComponent.vue'
import AppAsignarEstablecimiento from '@/components/AppAsignarEstablecimiento.vue'
import AppCambiarContrasenaComponent from '../components/AppCambiarContrasenaComponent.vue';
import useAuthStore from '@/store/auth'

const display = useDisplay()
const showIconBar = ref(true)
const dashboard = useDashboardStore()
const asideBar = ref(null)
const drawer = ref(true)

watch(
  () => display.width.value,
  (value) => {
    showIconBar.value = value < 600;
  }
)

const showEstablecimientoModal = ref(false);

const showCambiarContraseña = ref(false)

onMounted(async () => {
  const { establecimiento } = useAuthStore()
  if (establecimiento == null) {
    showEstablecimientoModal.value = true;
  }
  if (display.xs.value) {
    drawer.value = false;
  }
});

const close = async () => {
  showEstablecimientoModal.value = false;
}

const open = async () => {
  showEstablecimientoModal.value = true;
}


const closeCambiarContraseña = () => {
  showCambiarContraseña.value = false
}

const openCambiarContraseña = () => {
  showCambiarContraseña.value = true
}

</script>

<style scoped>

.app-bar {
  display: flex;
  justify-content: space-between;
  padding: 0 16px;
}

.app-bar-menu {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .app-bar {
    height: 60px;
    padding: 0 8px;
  }

  .app-bar-menu {
    justify-content: flex-end;
  }
}
</style>
