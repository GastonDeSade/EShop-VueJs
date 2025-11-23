<template>
  <h1 class="text-xl font-bold m-4 flex justify-center">{{ props.title }}</h1>
</template>
<script setup lang="ts">
import { defineProps } from 'vue'
defineOptions({ name: 'AppTitle' })
const props = defineProps<{ title: string }>()
</script>
