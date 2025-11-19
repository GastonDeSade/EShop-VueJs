<template>
  <div class="hero bg-base-200 h-full flex-1">
    <div class="hero-content flex-col">
      <div class="text-center">
        <h1 class="text-5xl font-bold">Login now!</h1>
        <p class="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
          exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div class="card-body">
          <form @submit.prevent="handleLogin" class="fieldset">
            <label class="label">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="votre.email@exemple.com"
              required
              :disabled="authStore.loading"
              class="input input-bordered w-full"
            />
            <label class="label">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="••••••••"
              required
              :disabled="authStore.loading"
              class="input input-bordered w-full"
            />
            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <button type="submit" :disabled="authStore.loading" class="btn btn-neutral mt-4">
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
