<template>
  <RouterLink :class="props.class" :to="props.link">{{ props.text }}</RouterLink>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { RouterLink } from 'vue-router'
const props = defineProps<{
  link: string
  text: string
  class?: string
}>()
</script>

<style scoped>
.primary {
  background: #2d8cf0;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}

.red {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.white {
  background: transparent;
  border: 1px solid #888;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
</style>
