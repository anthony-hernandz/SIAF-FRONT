<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  modelValue: String,
  label: {
    type: String,
    default: 'Campo de texto'
  },
  errorMessages: {
    type: Array,
    default: () => []
  },
  isPassword: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['update:modelValue']);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const hasError = computed(() => props.errorMessages.length > 0);
</script>

<template>
  <v-text-field
    variant="solo-inverted"
    :label="props.label"
    :type="props.isPassword && !showPassword ? 'password' : 'text'"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :error-messages="props.errorMessages"
    :class="{ 'error-border': hasError }"
  >
    <template #append-inner v-if="props.isPassword">
      <v-icon @click="togglePassword" class="cursor-pointer">
        {{ showPassword ? 'mdi-eye' : 'mdi-eye-off' }}
      </v-icon>
    </template>

  </v-text-field>
</template>

<style scoped>

.cursor-pointer {
  cursor: pointer;
}

::v-deep(.v-field--variant-solo-inverted) {
  border: 1px solid #6A83BE !important;
  border-radius: 2px;
  background: #ffffff;
}


.error-border ::v-deep(.v-field--variant-solo-inverted) {
  border: 1px solid #E63946 !important;
}

::v-deep(.v-field) {
  background: #ffffff !important;
}

::v-deep(.v-field-focused) {
  background: #ffffff !important;
}


</style>
