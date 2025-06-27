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
    rounded
    variant="solo-inverted"
    :label="props.label"
    :type="props.isPassword && !showPassword ? 'password' : 'text'"
    :model-value="props.modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    :error-messages="props.errorMessages"
    :class="{ 'error-border': hasError }"
  >
    <template #prepend-inner v-if="props.icon">
      <v-icon>{{ props.icon }}</v-icon>
    </template>
    <template #append-inner v-if="props.isPassword">
      <v-icon @click="togglePassword" class="cursor-pointer">
        {{ showPassword ? 'mdi-eye-off' : 'mdi-eye' }}
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
  border-radius: 35px;
}


.error-border ::v-deep(.v-field--variant-solo-inverted) {
  border: 1px solid #E63946 !important; /* Rojo o cualquier color de error */
}

::v-deep(.v-field--focused.v-field--variant-solo-inverted) {
  background: #4CAF50 !important; /* Verde o el color que prefieras */
}


</style>
