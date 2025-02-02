<template>
  <button :class="[
    'app-button',
    `app-button--${variant}`,
    { 'app-button--loading': loading }
  ]" :disabled="disabled || loading" @click="$emit('click')">
    <LoadingSpinner v-if="loading" class="button-spinner" />
    <slot v-else></slot>
  </button>
</template>

<script setup>
import LoadingSpinner from './LoadingSpinner.vue'

defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success'].includes(value)
  },
  loading: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>

<style scoped>
.app-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 100px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.app-button--primary {
  background-color: #3498db;
  color: white;
}

.app-button--secondary {
  background-color: #95a5a6;
  color: white;
}

.app-button--danger {
  background-color: #e74c3c;
  color: white;
}

.app-button--success {
  background-color: #2ecc71;
  color: white;
}

.app-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.app-button--loading {
  opacity: 0.7;
  cursor: wait;
}

.button-spinner {
  width: 20px;
  height: 20px;
}
</style>