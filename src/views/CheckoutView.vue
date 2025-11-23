<template>
  <div class="array-page">
    <Title title="Votre commande" />
    <table class="table-auto">
      <thead>
        <tr>
          <th class="hidden sm:table-cell">Image</th>
          <th>Produit</th>
          <th class="hidden sm:table-cell">Prix</th>
          <th>Quantité</th>
          <th>Sous-total</th>
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
            <div class="font-semibold">{{ item.product.name }}</div>
          </td>
          <td class="hidden sm:table-cell">{{ item.product.price }}</td>
          <td>{{ item.quantity }}</td>
          <td>{{ item.product.price * item.quantity }}</td>
        </tr>
      </tbody>
    </table>

    <div class="flex justify-between items-center gap-4 mt-4">
      <BoutonLink :class="'white'" :text="'Retour'" :link="'/cart'" />
      Total <strong> {{ total }}</strong>
      <BoutonLink
        :class="'primary'"
        :text="'Valider la commande'"
        :link="'#'"
        @click="createOrder"
      />
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
import BoutonLink from '@/components/BoutonLink.vue'
import Title from '@/components/Title.vue'
import { minimizeText } from '@/services/formatService'

const cart = useCartStore()
const products = ref(cart.items)
const total = ref<number>(0)

onMounted(async () => {
  total.value = products.value.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  )
  console.log(products.value)
})

async function createOrder(): Promise<void> {
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
    alert(`Commande ${minimizeText(order.Id ?? '', 10)} créée avec succès !`)
    try {
      await router.push({ name: 'order' })
    } catch (navError) {
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
