<script setup>
defineProps({
  title: String,
  classText: {
    type: String,
    default: 'text-h4'
  }
})
</script>

<template>
  <v-row class="flex-row text-center ml-n8">
    <v-col cols="12" sm="12" md="12" class="mx-auto">
      <h1 class="font-weight-bold" :class="classText" style="color: #1c1e4d">
        {{ title }}
      </h1>
    </v-col>
  </v-row>
</template>
