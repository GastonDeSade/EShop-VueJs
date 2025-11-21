import type { Order, OrderDto, OrderUpDTO } from '@/types/order'
import { productService } from '@/services/productService'

const API_BASE_URL = 'http://localhost:5266/api'

export const orderService = {
  async createOrder(order: OrderDto): Promise<OrderUpDTO> {
    const response = await fetch(`${API_BASE_URL}/Orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(order),
    })

    if (!response.ok) {
      const text = await response.text()
      try {
        const error = JSON.parse(text)
        throw new Error(error.title || error.detail || 'Erreur lors de la création de la commande')
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    return await response.json()
  },

  async fetchOrderById(id: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/Orders/${encodeURIComponent(id)}`, {
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
          error.title || error.detail || 'Erreur lors de la récupération de la commande',
        )
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    const order: Order = await response.json()
    return order
  },

  async fetchOrdersByUser(userId: string): Promise<Order[]> {
    const response = await fetch(`${API_BASE_URL}/Orders/${encodeURIComponent(userId)}/by-user`, {
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
          error.title ||
            error.detail ||
            "Erreur lors de la récupération des commandes de l'utilisateur",
        )
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    const req = await response.json()

    // API can return either an array directly or an object with a `data` array.
    const rawOrders = Array.isArray(req) ? req : (req?.data ?? [])

    const orders: Order[] = (rawOrders as unknown[]).map((o) => o as Order)

    // Enrich orderProducts with product details when only productId is provided
    await Promise.all(
      orders.map(async (order) => {
        if (!order.orderProducts || order.orderProducts.length === 0) return
        await Promise.all(
          order.orderProducts.map(async (op) => {
            if (op.productId) {
              try {
                op.product = await productService.fetchProductById(op.productId)
              } catch (e) {
                console.warn('Failed to fetch product for', op.productId, e)
              }
            }
          }),
        )
      }),
    )

    return orders
  },

  async deleteOrder(id: string): Promise<void> {
    // Manifest: DELETE /api/Orders with id as query parameter
    const response = await fetch(`${API_BASE_URL}/Orders?id=${encodeURIComponent(id)}`, {
      method: 'DELETE',
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
          error.title || error.detail || 'Erreur lors de la suppression de la commande',
        )
      } catch (e) {
        if (e instanceof Error && !e.message.includes('JSON')) {
          throw e
        }
        throw new Error(`Erreur ${response.status}: ${text.substring(0, 200)}`)
      }
    }

    return
  },
}

export default {}
