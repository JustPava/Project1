<template>
  <div v-if="message" :class="['status-message', type]">
    <p>{{ message }}</p>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';


defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String, 
    required: true,
  },
});
</script>

<style scoped>
.status-message {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
}

.status-message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-message.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>