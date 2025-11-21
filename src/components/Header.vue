<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { SunMoon, Sun, ShoppingCart, ListOrdered } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

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
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-circle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </div>
        <ul
          tabindex="-1"
          class="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
        >
          <li><a>Homepage</a></li>
          <li><a>Portfolio</a></li>
          <li><a>About</a></li>
          <li v-if="authStore.isAuthenticated">
            <button @click="handleLogout" class="btn-secondary">Se déconnecter</button>
          </li>
          <div v-else>
            <li><router-link to="/login" class="btn"> Se connecter </router-link></li>
            <li><router-link to="/register" class="btn"> S'inscrire </router-link></li>
          </div>
        </ul>
      </div>
    </div>
    <div class="navbar-center">
      <router-link to="/" class="btn btn-ghost normal-case text-xl">Jade</router-link>
    </div>
    <div class="navbar-end">
      <button class="btn btn-ghost btn-circle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
      <button class="btn btn-ghost btn-circle">
        <label class="swap swap-rotate">
          <input type="checkbox" @click="toggleTheme" />
          <div class="swap-on"><SunMoon /></div>
          <div class="swap-off"><Sun /></div>
        </label>
      </button>
      <RouterLink class="btn btn-ghost btn-circle" to="/cart">
        <div class="swap-off"><ShoppingCart /></div>
      </RouterLink>
      <RouterLink class="btn btn-ghost btn-circle" to="/order">
        <div class="swap-off"><ListOrdered /></div>
      </RouterLink>
    </div>
  </div>
</template>
