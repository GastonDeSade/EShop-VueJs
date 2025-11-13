<template>
  <div class="">
    <div class="">
      <h1>Connexion</h1>

      <form @submit.prevent="handleLogin" class="">
        <div class="">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="votre.email@exemple.com"
            required
            :disabled="authStore.loading"
            class="input input-bordered w-full"
          />
        </div>

        <div class="">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            :disabled="authStore.loading"
            class="input input-bordered w-full"
          />
        </div>

        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
        </div>

        <button type="submit" :disabled="authStore.loading" class="">
          {{ authStore.loading ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <div class="login-footer">
        <p>
          Pas encore de compte ?
          <router-link to="/register" class="link">S'inscrire</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const handleLogin = async () => {
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  })

  if (success) {
    router.push('/')
  }
}
</script>
