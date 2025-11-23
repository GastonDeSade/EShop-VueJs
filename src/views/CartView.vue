<template>
  <div class="array-page">
    <Title title="Mon panier" />

    <div v-if="!hasItems" class="empty flex flex-col gap-4">
      <p>Votre panier est vide.</p>
      <BoutonLink :class="'primary'" :text="'Voir les produits'" :link="'/'" />
    </div>

    <div v-else class="">
      <table class="table-auto">
        <thead>
          <tr>
            <th class="hidden sm:table-cell">Image</th>
            <th>Produit</th>
            <th class="hidden sm:table-cell">Prix</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cart.items" :key="item.product.id">
            <td class="gap-4 items-center hidden sm:table-cell">
              <img
                v-if="item.product.image"
                :src="item.product.image"
                :alt="item.product.name"
                class="thumb"
              />
            </td>
            <td>
              <div class="font-semibold">
                {{ item.product.name }}
              </div>
            </td>
            <td class="hidden sm:table-cell">
              {{ formatCurrency(item.product.price ?? 0) }}
            </td>
            <td>
              <QtyControls
                :productId="item.product.id"
                :quantity="item.quantity"
                @decrease="onDecrease"
                @increase="onIncrease"
              />
            </td>
            <td>
              {{ formatCurrency((item.product.price ?? 0) * item.quantity) }}
            </td>
            <td>
              <BoutonLink :class="'red'" :text="'X'" :link="'#'" @click="remove(item.product.id)" />
            </td>
          </tr>
        </tbody>
      </table>

      <div class="flex justify-between items-center gap-4 mt-4">
        <BoutonLink :class="'white'" :text="'Continuer mes achats'" :link="'/'" />
        <div>
          Total: <strong>{{ formatCurrency(total) }}</strong>
        </div>
        <BoutonLink :class="'primary'" :text="'Passer la commande'" :link="'/checkout'" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import { productService } from '@/services/productService'
import type { Product } from '@/types/product'
import BoutonLink from '@/components/BoutonLink.vue'
import QtyControls from '@/components/QtyControls.vue'
import Title from '@/components/Title.vue'
import { formatCurrency } from '@/services/formatService'

const cart = useCartStore()
const products = ref(cart.items)

onMounted(async () => {
  products.value = await cart.items
})

const productsMap = ref<Record<string, Product | null>>({})

const hasItems = computed(() => cart.items.length > 0)

async function loadProducts() {
  const idsToLoad = cart.items.map((it) => it.product.id).filter((id) => !(id in productsMap.value))
  await Promise.all(
    idsToLoad.map(async (id) => {
      try {
        const product = await productService.fetchProductById(String(id))
        productsMap.value[id] = product
      } catch (e) {
        console.error(`Failed to load product with id ${id}:`, e)
        productsMap.value[id] = null
      }
    }),
  )
}

watch(
  () => cart.items.map((i) => `${i.product.id}:${i.quantity}`).join('|'),
  () => {
    loadProducts()
  },
)

const total = computed(() => {
  return cart.items.reduce((acc, it) => {
    const p = it.product
    const price = p?.price ?? it.product.price ?? 0
    return acc + price * it.quantity
  }, 0)
})

function remove(productId: string) {
  cart.removeFromCart(productId)
}

function onIncrease(productId: string) {
  cart.addToCart(productId)
}

function onDecrease(productId: string) {
  cart.removeFromCart(productId)
}
</script>

<style scoped>
.empty {
  text-align: center;
}
.product-cell {
  display: flex;
  gap: 12px;
  align-items: center;
}
</style>
