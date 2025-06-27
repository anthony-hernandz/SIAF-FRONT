<script setup>
import { computed } from 'vue'
import { useDisplay } from 'vuetify/lib/framework.mjs'

const { xs, sm, md, lg, xl } = useDisplay()

const sizeTitle = computed(() => {
  if (xs.value) return 'text-h5'
  if (sm.value) return 'text-h4'
  if (md.value) return 'text-h3'
  if (lg.value) return 'text-h2'
  if (xl.value) return 'text-h2'
})

const stylesTextSize = computed(() => {
  if (xs.value)
    return {
      fontSize: '1.2rem',
      lineHeight: '1.5rem'
    }
  if (sm.value) return { fontSize: '1.4rem', lineHeight: '1.6rem' }
  if (md.value) return { fontSize: '1.6rem', lineHeight: '1.8rem' }
  if (lg.value) return { fontSize: '1.8rem', lineHeight: '2rem' }
  if (xl.value) return { fontSize: '2rem', lineHeight: '2.2rem' }
})
</script>

<template>
  <v-row class="d-flex justify-center align-center text-center whFull">
    <v-col cols="12">
      <app-title-component title="403 Acceso denegado" :class-text="sizeTitle" />
      <p class="my-4" :style="stylesTextSize">
        Lo sentimos, no tienes permiso para acceder a esta página.
      </p>
      <app-button-component
        title="Volver al inicio"
        colors="primary"
        width-size="content"
        @btnAction="() => $router.push({ name: 'dashboard' })"
      />
    </v-col>
  </v-row>
</template>

<style scoped>
.whFull {
  width: 100vw;
  height: 100vh;
  overflow: hidden !important;
}
</style>
