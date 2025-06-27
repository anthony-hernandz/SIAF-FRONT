<script setup>
const props = defineProps({
  title: {
    type: String
  },
  colors: {
    type: String,
    default: '#1C1E4D'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  outlined: {
    type: Boolean,
    default: false
  },
  widthSize: {
    type: String,
    default: '200px'
  },
  extraProps: {
    type: Object,
    default: () => {}
  },
  extraClass: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: 'position-absolute-right'
  },
  sendRequest: {
    type: Boolean,
    default: false
  },
  isBlockSize:{
    type: Boolean,
    default:false
  },
})

const emit = defineEmits(['btnAction'])

const handleButton = () => {
  emit('btnAction')
}
</script>

<template>
  <div>
    <v-btn
      v-bind="props.extraProps"
      :width="props.widthSize"
      :disabled="props.disabled"
      :variant="props.outlined ? 'outlined' : 'elevated'"
      :color="props.colors"
      :class="['rounded-btn', props.extraClass]"
      style="text-transform: none"
      :style="props.buttonStyle"
      @click="handleButton"
      :loading="props.sendRequest"
      :block="props.isBlockSize"
    >
      {{ props.title }}
      <v-icon :class="props.iconClass" v-if="props.icon !== ''">{{ props.icon }}</v-icon>
    </v-btn>
  </div>
</template>

<style scoped>

  .position-absolute-left {
    position: absolute !important;
    left: 0 !important;
  }

  .position-absolute-right {
    position: absolute !important;
    right: 0 !important;
  }

  .rounded-btn {
    border-radius: 50px !important;
    height: 50px !important;
  }
</style>
