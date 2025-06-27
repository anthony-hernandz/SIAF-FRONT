<script setup>
defineProps({
  color: {
    type: String,
    default: ''
  },
  fontColor: {
    type: String,
    default: 'white'
  },
  title: {
    type: String,
    default: ''
  },
  border: {
    type: String,
    default: '#000000 md'
  }
})
</script>

<template>
  <div class="d-flex align-center justify-center">
    <v-chip :color="color" :border="border" variant="flat" class="d-flex align-center justify-center custom-chip rounded-lg">
      <span
        :style="{
          color: fontColor
        }"
        >{{ title }}</span
      >
    </v-chip>
  </div>
</template>

<style scoped>
.custom-chip {
  min-width: 186px;
  max-width: max-content;
}
</style>
