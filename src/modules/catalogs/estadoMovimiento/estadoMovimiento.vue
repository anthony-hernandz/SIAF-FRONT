<script setup>
import { useDisplay } from 'vuetify/lib/framework.mjs'
import {ref,onMounted } from 'vue'
import AppLoaderComponent from '@/components/AppLoaderComponent.vue'

const { xs, sm, md, lg, xl } = useDisplay()
const display = ref(useDisplay())
onMounted(() => {

})

</script>

<template>
  <app-loader-component />
  <v-main style="margin: 0; padding: 0">
    <v-row style="height: 100% !important; ">
    </v-row>
  </v-main>
</template>

<style scoped>
</style>
