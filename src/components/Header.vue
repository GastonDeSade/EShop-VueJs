<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'

defineOptions({ name: 'AppHeader' })

const theme = ref<'light' | 'business'>('light')

const toggleTheme = () => {
  theme.value = theme.value === 'business' ? 'light' : 'business'
}

// Apply theme to HTML tag on mount and when theme changes
onMounted(() => {
  document.querySelector('html')?.setAttribute('data-theme', theme.value)
})

watch(theme, (newTheme) => {
  document.querySelector('html')?.setAttribute('data-theme', newTheme)
})
</script>

<template>
  <header>
    <label class="swap swap-rotate">
      <input type="checkbox" @click="toggleTheme" />
      <div class="swap-on">DARKMODE</div>
      <div class="swap-off">LIGHTMODE</div>
    </label>
  </header>
</template>
