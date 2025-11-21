<template>
  <h1>Liste de vos commandes</h1>
  <div>
    <div
      class="grid grid-flow-row justify-items-center align-middle items-center justify-center md:grid-cols-3 xl:grid-cols-4 gap-4"
    >
      <!-- Bouclez sur les commandes et affichez leurs détails -->
      <div v-for="order in orders" :key="order.id" class="card w-96 bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title">Commande #{{ order.id }}</h2>
          <p>
            Date de la commande:
            {{ order.created ? new Date(order.created).toLocaleDateString() : 'N/A' }}
          </p>
          <div>
            <h3>Produits:</h3>
            <ul>
              <li v-for="item in order.orderProducts" :key="item.productId">
                {{ item.product?.name ?? item.productId }} - Quantité: {{ item.quantity ?? 0 }}
              </li>
            </ul>
          </div>
          <p>
            Total:
            {{
              order.orderProducts?.reduce(
                (sum, item) => sum + (item.product?.price ?? 0) * (item.quantity ?? 0),
                0,
              ) ?? 'N/A'
            }}
            €
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { orderService } from '@/services/orderService'
import type { Order } from '@/types/order'
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

// reactive orders exposed to the template
const orders = ref<Order[]>([])
const authStore = useAuthStore()

onMounted(async () => {
  const userId = authStore.user?.id ?? ''
  if (!userId) {
    console.warn('No user id available - skipping orders fetch')
    return
  }
  try {
    orders.value = await orderService.fetchOrdersByUser(userId)
  } catch (err) {
    console.error('Failed to fetch orders', err)
  }
})
</script>
