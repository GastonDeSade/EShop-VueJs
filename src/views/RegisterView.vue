<template>
  <div class="hero bg-base-200 h-full flex-1">
    <div class="hero-content flex-col lg:flex-row-reverse">
      <div class="text-center lg:text-left">
        <h1 class="text-5xl font-bold">Inscrivez-vous maintenant!</h1>
        <p class="py-6">
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi
          exercitationem quasi. In deleniti eaque aut repudiandae et a id nisi.
        </p>
      </div>
      <div class="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div class="card-body">
          <form class="fieldset" @submit.prevent="handleRegister">
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
              minlength="6"
              class="input input-bordered w-full"
            />
            <label class="label">Confirmer le mot de passe</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="••••••••"
              required
              :disabled="authStore.loading"
              class="input input-bordered w-full"
            />
            <div v-if="localError" class="error-message">
              {{ localError }}
            </div>

            <div v-if="authStore.error" class="error-message">
              {{ authStore.error }}
            </div>

            <div v-if="successMessage" class="success-message">
              {{ successMessage }}
            </div>

            <button type="submit" :disabled="authStore.loading" class="btn btn-neutral mt-4">
              {{ authStore.loading ? 'Inscription...' : "S'inscrire" }}
            </button>
          </form>
          <p>
            Déjà un compte ?
            <router-link to="/login" class="link">Se connecter</router-link>
          </p>
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
const confirmPassword = ref('')
const localError = ref('')
const successMessage = ref('')

const handleRegister = async () => {
  localError.value = ''
  successMessage.value = ''

  // Validation du mot de passe
  if (password.value !== confirmPassword.value) {
    localError.value = 'Les mots de passe ne correspondent pas'
    return
  }

  if (password.value.length < 6) {
    localError.value = 'Le mot de passe doit contenir au moins 6 caractères'
    return
  }

  const success = await authStore.register({
    email: email.value,
    password: password.value,
  })

  if (success) {
    successMessage.value = 'Inscription réussie ! Redirection vers la connexion...'
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }
}
</script>
