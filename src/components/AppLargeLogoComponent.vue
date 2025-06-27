<template>
  <v-img
    :src="logo"
    :height="height"
    :width="width"
    :max-width="maxWidth"
    :max-height="maxHeight"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  light: {
    type: Boolean,
    default: false
  },
  dark: {
    type: Boolean,
    default: false
  },
  height: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: ''
  },
  maxWidth: {
    type: String,
    default: ''
  },
  maxHeight: {
    type: String,
    default: ''
  }
})

const darkLogo = new URL('../assets/img/logo_large_dark.png', import.meta.url).href
const whiteLogo = new URL('../assets/img/logo_large_white.png', import.meta.url).href

const logo = computed(() => {
  if (props.dark) {
    return darkLogo
  }
  if (props.light) {
    return whiteLogo
  }
  return ""
})

</script>
