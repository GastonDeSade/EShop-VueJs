<template>
  <div class="">
    <div class="">
      <div class="">
        <h2 class="text-xl font-bold m-4 flex justify-center">Votre commande</h2>
        <div
          class="grid grid-flow-row justify-items-center align-middle items-center justify-center md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <table>
            <tr v-for="product in products" :key="product.id">
              <td>{{ product.product.name }}</td>
              <td>{{ product.product.price }} €</td>
              <td>Quantité: {{ product.quantity }}</td>
              <td>Total: {{ product.product.price * product.quantity }} €</td>
            </tr>
          </table>
          Au total : {{ total }} €
          {{ useAuthStore().user?.id }}
        </div>

        <div>
          <button @click="createOrder" class="btn" type="button">Valider la commande</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'
import type { OrderDto } from '@/types/order'
import { orderService } from '@/services/orderService'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'
import type { OrderUpDTO } from '@/types/order'

const cart = useCartStore()
const products = ref<any[]>([])
const total = ref<number>(0)

onMounted(async () => {
  products.value = await cart.items
  total.value = products.value.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
  console.log(products.value)
})

async function createOrder() {
  const orderDto: OrderDto = {
    idUser: useAuthStore().user?.id ?? '',
    orderProducts: products.value.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    })),
  }

  try {
    const order: OrderUpDTO = await orderService.createOrder(orderDto)
    cart.clearCart()
    // show success to the user first
    alert('Commande créée avec succès !')
    // then navigate; await so navigation failures don't get swallowed as order errors
    try {
      await router.push({ name: 'order' })
    } catch (navError) {
      // navigation failure is non-critical here; log for debugging
      console.error('Navigation failure after order creation:', navError)
    }
  } catch (error) {
    // Log full error for debugging
    console.error('Error creating order:', error)
    // Prepare a readable message for the user
    const errObj = error as { message?: unknown } | undefined
    const message =
      errObj && typeof errObj.message === 'string'
        ? errObj.message
        : error && typeof error === 'object'
          ? JSON.stringify(error)
          : String(error)

    alert(`Erreur lors de la création de la commande: ${message}`)
  }
}
</script>
