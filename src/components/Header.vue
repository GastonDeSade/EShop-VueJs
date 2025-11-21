<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { SunMoon, Sun, ShoppingCart, ListOrdered, LogOut, LogIn, UserPlus } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

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
  <div class="navbar h-full items-center bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div v-if="authStore.isAuthenticated">
        <button @click="handleLogout" class="btn btn-ghost btn-circle">
          <div class="swap-off"><LogOut /></div>
        </button>
      </div>
      <div v-else>
        <RouterLink class="btn btn-ghost btn-circle" to="/login">
          <div class="swap-off"><LogIn /></div>
        </RouterLink>
        <RouterLink class="btn btn-ghost btn-circle" to="/register">
          <div class="swap-off"><UserPlus /></div>
        </RouterLink>
      </div>
    </div>
    <div class="navbar-center">
      <router-link to="/" class="btn btn-ghost normal-case text-xl">Jade</router-link>
    </div>
    <div class="navbar-end">
      <RouterLink class="btn btn-ghost btn-circle indicator" to="/cart">
        <span class="indicator-item indicator-start badge bg-primary text-white">{{
          cartStore.getTotalItems()
        }}</span>
        <div class="swap-off"><ShoppingCart /></div>
      </RouterLink>
      <RouterLink class="btn btn-ghost btn-circle" to="/order">
        <div class="swap-off"><ListOrdered /></div>
      </RouterLink>
      <button class="btn btn-ghost btn-circle">
        <label class="swap swap-rotate">
          <input type="checkbox" @click="toggleTheme" />
          <div class="swap-on"><SunMoon /></div>
          <div class="swap-off"><Sun /></div>
        </label>
      </button>
    </div>
  </div>
</template>
