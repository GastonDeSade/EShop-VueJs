<template>
  <div class="">
    <div class="">
      <h1 class="">Bienvenue sur EShop</h1>

      <div v-if="authStore.isAuthenticated" class="authenticated-section">
        <p class="welcome-message">
          Bonjour, <strong>{{ authStore.user?.email }}</strong> !
        </p>

        <div class="actions">
          <button @click="handleLogout" class="btn-secondary">Se déconnecter</button>
        </div>
      </div>

      <div v-else class="unauthenticated-section">
        <p class="info-message">Connectez-vous ou créez un compte pour commencer vos achats</p>

        <div class="actions">
          <router-link to="/login" class="btn-primary"> Se connecter </router-link>
          <router-link to="/register" class="btn-secondary"> S'inscrire </router-link>
        </div>
      </div>
    </div>
  </div>
  <button class="btn">Button</button>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<style scoped></style>
