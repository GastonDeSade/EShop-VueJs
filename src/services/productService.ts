import type { Product } from '@/types/product'
const API_BASE_URL = 'http://localhost:5266/api'

export const productService = {
  async fetchProducts(): Promise<Product[]> {
    const response = await fetch(`${API_BASE_URL}/products?page=1&pageSize=10`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const error = JSON.parse(text)
        throw new Error(
          error.title || error.detail || 'Erreur lors de la récupération des produits',
        )
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    const req = await response.json()
    const products: Product[] = req.data
    return products
  },
  async fetchProductById(id: string): Promise<Product> {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const error = JSON.parse(text)
        throw new Error(error.title || error.detail || 'Erreur lors de la récupération du produit')
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    const product: Product = await response.json()
    return product
  },
}
