import { defineStore } from 'pinia'
import { ref } from 'vue'
import { authService } from '@/services/authService'
import type { LoginRequest, RegisterRequest, User } from '@/types/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const isAuthenticated = ref(false)

  async function login(credentials: LoginRequest) {
    loading.value = true
    error.value = null

    try {
      await authService.login(credentials)

      // Charger les informations de l'utilisateur après connexion
      await loadUser()
      isAuthenticated.value = true

      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erreur de connexion'
      isAuthenticated.value = false
      return false
    } finally {
      loading.value = false
    }
  }

  async function register(data: RegisterRequest) {
    loading.value = true
    error.value = null

    try {
      await authService.register(data)
      return true
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Erreur lors de l'inscription"
      return false
    } finally {
      loading.value = false
    }
  }

  async function loadUser() {
    try {
      const userData = await authService.getCurrentUser()
      user.value = userData as User
      isAuthenticated.value = true
    } catch (err) {
      console.error("Erreur lors du chargement de l'utilisateur:", err)
      user.value = null
      isAuthenticated.value = false
    }
  }

  function logout() {
    authService.logout()
    user.value = null
    isAuthenticated.value = false
  }

  // Vérifier si l'utilisateur est connecté au chargement
  loadUser()

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    loadUser,
  }
})
