import type { LoginRequest, RegisterRequest } from '@/types/auth'

const API_BASE_URL = 'http://localhost:5266'

export const authService = {
  async login(credentials: LoginRequest): Promise<void> {
    try {
      const response = await fetch(`${API_BASE_URL}/login?useCookies=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important pour envoyer/recevoir les cookies
        body: JSON.stringify(credentials),
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const text = await response.text()
        console.error('Error response:', text)

        try {
          const error = JSON.parse(text)
          throw new Error(
            error.title ||
              error.detail ||
              error.message ||
              `Erreur ${response.status}: ${text.substring(0, 200)}`,
          )
        } catch (e) {
          if (e instanceof Error && !e.message.includes('JSON')) {
            throw e
          }
          throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
        }
      }
      console.log('Login successful with cookies')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async register(data: RegisterRequest): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const error = JSON.parse(text)
        throw new Error(error.title || error.detail || "Erreur lors de l'inscription")
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error("Erreur lors de l'inscription")
      }
    }
  },

  async logout(): Promise<void> {
    // Appeler l'endpoint de logout si disponible
    // Pour l'instant, on nettoie juste côté client
  },

  async getCurrentUser(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include', // Envoyer les cookies avec la requête
    })

    if (!response.ok) {
      throw new Error('Impossible de récupérer les informations utilisateur')
    }

    const text = await response.text()
    if (!text) {
      return null
    }

    return JSON.parse(text)
  },
}
