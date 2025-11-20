<template>
  <div class="cart-page">
    <h1>Mon panier</h1>

    <div v-if="!hasItems" class="empty">
      <p>Votre panier est vide.</p>
      <router-link to="/">Voir les produits</router-link>
    </div>

    <div v-else class="cart-content">
      <table class="cart-table">
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.product.id">
            <td class="product-cell">
              <img
                v-if="getProduct(item.product.id) && getProduct(item.product.id)?.image"
                :src="getProduct(item.product.id)?.image"
                :alt="getProduct(item.product.id)?.name || item.product.name"
                class="thumb"
              />
              <div class="meta">
                <div class="name">
                  {{ getProduct(item.product.id)?.name || item.product.name || 'Produit inconnu' }}
                </div>
                <div class="desc">
                  {{ getProduct(item.product.id)?.description || item.product.description || '' }}
                </div>
              </div>
            </td>
            <td>
              {{ formatCurrency(getProduct(item.product.id)?.price ?? item.product.price ?? 0) }}
            </td>
            <td>
              <div class="qty-controls">
                <button @click="decrease(item.product.id)">-</button>
                <span class="qty">{{ item.quantity }}</span>
                <button @click="increase(item.product.id)">+</button>
              </div>
            </td>
            <td>
              {{
                formatCurrency(
                  (getProduct(item.product.id)?.price ?? item.product.price ?? 0) * item.quantity,
                )
              }}
            </td>
            <td>
              <button class="btn-remove" @click="remove(item.product.id)">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="cart-footer">
        <div class="left">
          <button class="btn-clear" @click="clear">Vider le panier</button>
        </div>
        <div class="right">
          <div class="total">
            Total: <strong>{{ formatCurrency(total) }}</strong>
          </div>
          <button class="btn-checkout" @click="checkout">Passer la commande</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useCartStore } from '@/stores/cart'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'
import { useRouter } from 'vue-router'

const cart = useCartStore()
const router = useRouter()

// Map productId (string) -> Product | null
const productsMap = ref<Record<string, Product | null>>({})

function getProduct(id: string): Product | null {
  return productsMap.value[id] ?? null
}

const hasItems = computed(() => cart.items.length > 0)

function formatCurrency(v: number) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(v)
}

async function loadProducts() {
  const idsToLoad = cart.items.map((it) => it.product.id).filter((id) => !(id in productsMap.value))

  await Promise.all(
    idsToLoad.map(async (id) => {
      try {
        const product = await productService.fetchProductById(String(id))
        productsMap.value[id] = product
      } catch (e) {
        // keep null to indicate missing product
        productsMap.value[id] = null
        // console.warn can be helpful during dev
        console.warn('Impossible de charger le produit', id, e)
      }
    }),
  )
}

onMounted(() => {
  loadProducts()
})

watch(
  () => cart.items.map((i) => `${i.product.id}:${i.quantity}`).join('|'),
  () => {
    loadProducts()
  },
)

const total = computed(() => {
  return cart.items.reduce((acc, it) => {
    const p = getProduct(it.product.id)
    const price = p?.price ?? it.product.price ?? 0
    return acc + price * it.quantity
  }, 0)
})

function remove(productId: string) {
  cart.removeFromCart(productId)
  // also remove from productsMap to free memory (optional)
  delete productsMap.value[productId]
}

function clear() {
  cart.clearCart()
  productsMap.value = {}
}

function increase(productId: string) {
  cart.addToCart(productId)
}

function decrease(productId: string) {
  const item = cart.items.find((i) => i.product.id === productId)
  if (!item) return
  if (item.quantity > 1) {
    // mutate directly (items is a ref), allowed by store
    item.quantity -= 1
  } else {
    remove(productId)
  }
}

function checkout() {
  // Placeholder: In a real app, navigate to checkout or call an API.
  // Here we navigate to a (non-existent) /checkout route if present, else clear and notify.
  try {
    router.push({ path: '/checkout' })
  } catch {
    // fallback behaviour
    alert('Checkout non implémenté dans cette démo. Le panier va être vidé.')
    clear()
  }
}
</script>

<style scoped>
.cart-page {
  max-width: 980px;
  margin: 32px auto;
  padding: 0 16px;
}
.empty {
  text-align: center;
}
.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
}
.cart-table th,
.cart-table td {
  text-align: left;
  padding: 12px 8px;
  border-bottom: 1px solid #e6e6e6;
  vertical-align: middle;
}
.product-cell {
  display: flex;
  gap: 12px;
  align-items: center;
}
.thumb {
  width: 72px;
  height: 72px;
  object-fit: cover;
  border-radius: 6px;
}
.meta .name {
  font-weight: 600;
}
.qty-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}
.qty-controls button {
  width: 28px;
  height: 28px;
  border: 1px solid #ccc;
  background: white;
  cursor: pointer;
}
.btn-remove {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
}
.cart-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
.btn-clear {
  background: transparent;
  border: 1px solid #888;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
}
.btn-checkout {
  background: #2d8cf0;
  color: white;
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
}
.total {
  margin-bottom: 8px;
  text-align: right;
}
</style>
