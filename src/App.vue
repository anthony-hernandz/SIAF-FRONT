<script setup>

import AppLoader from './components/AppLoaderComponent.vue'
import AppFooter from './components/AppFooterComponent.vue'
</script>

<template>
  <div>
    <v-app>
    <app-loader />
    <router-view />
    <app-footer></app-footer>
    </v-app>
  </div>
</template>

<style lang="scss">
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  -webkit-border-radius: 6px;
  border-radius: 6px;
}
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 6px;
  border-radius: 6px;
  background: rgb(var(--v-theme-primary));
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgb(var(--v-theme-primary));
}
</style>
