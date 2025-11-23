<template>
  <div class="qty-controls">
    <button @click="onDecrease">-</button>
    <span class="qty">{{ props.quantity }}</span>
    <button @click="onIncrease">+</button>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ productId: string; quantity: number }>()

const emit = defineEmits<{
  (e: 'increase', id: string): void
  (e: 'decrease', id: string): void
}>()

function onIncrease() {
  emit('increase', props.productId)
}

function onDecrease() {
  emit('decrease', props.productId)
}
</script>

<style scoped>
.qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-controls button {
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
.qty {
  min-width: 20px;
  text-align: center;
  display: inline-block;
}
</style>
