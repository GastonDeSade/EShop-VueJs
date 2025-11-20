import type { Product } from '@/types/product'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<Array<{ product: Product; quantity: number }>>([])

  function addToCart(productId: string) {
    const existingItem = items.value.find((item) => item.product.id === productId)
    if (existingItem) {
      existingItem.quantity++
    } else {
      items.value.push({ product: { id: productId } as Product, quantity: 1 })
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
  return {
    items,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalItems,
  }
})
