<script setup>
defineProps({
  text: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  size:{
    type: String,
    default:'medium'
  },
  color:{
    type: String,
    default: 'default'
  }
})

const emit = defineEmits(['btnAction'])

const btnAction = () => {
  emit('btnAction')
}
</script>

<template>
  <v-tooltip :text="text" location="bottom">
    <template v-slot:activator="{ props }">
      <v-icon :size="props.size" @click="btnAction" class="mr-2" :color="props.color" v-bind="props">
        {{ icon }}
      </v-icon>
    </template>
  </v-tooltip>
</template>
