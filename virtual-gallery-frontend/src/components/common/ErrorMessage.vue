<template>
  <div class="error-message" :class="type">
    <span class="error-icon">⚠️</span>
    <p class="error-text">{{ message }}</p>
    <button v-if="retryAction" @click="retryAction" class="retry-button">
      Retry
    </button>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'warning', 'info'].includes(value)
  },
  retryAction: {
    type: Function,
    default: null
  }
})
</script>

<style scoped>
.error-message {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}

.error-message.error {
  background-color: #ffe6e6;
  border: 1px solid #ff9999;
}

.error-message.warning {
  background-color: #fff3e6;
  border: 1px solid #ffd699;
}

.error-message.info {
  background-color: #e6f3ff;
  border: 1px solid #99ccff;
}

.error-icon {
  margin-right: 0.5rem;
}

.error-text {
  margin: 0;
  flex-grow: 1;
}

.retry-button {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.retry-button:hover {
  background-color: #2980b9;
}
</style>