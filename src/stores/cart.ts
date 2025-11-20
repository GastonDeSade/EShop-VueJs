import { productService } from '@/services/productService'
import type { Product } from '@/types/product'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Array<{ product: Product; quantity: number }>>([])

  async function addToCart(productId: string) {
    const existingItem = items.value.find((item) => item.product.id === productId)
    if (existingItem) {
      existingItem.quantity++
    } else {
      const product = await productService
        .fetchProductById(productId)
        .catch(() => ({ id: productId }) as Product)
      items.value.push({ product, quantity: 1 })
    }
  }

  function removeFromCart(productId: string) {
    items.value = items.value.filter((item) => item.product.id !== productId)
  }

  function clearCart() {
    items.value = []
  }

  function getTotalItems() {
    return items.value.reduce((total, item) => total + item.quantity, 0)
  }

  async function getCartProducts(): Promise<Product[] | undefined> {
    const products = ref<Product[]>([])
    const ids = items.value.map((it) => it.product.id)
    if (ids.length === 0) {
      return []
    }

    products.value = await Promise.all(
      ids.map(async (id) => {
        try {
          return await productService.fetchProductById(String(id))
        } catch {
          return { id } as Product
        }
      }),
    )

    return products.value
  }

  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems,
    getCartProducts,
  }
})
