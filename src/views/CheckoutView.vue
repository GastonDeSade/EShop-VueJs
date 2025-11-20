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
        </div>

        <div>
          <a class="btn" href="">Valider la commande</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useCartStore } from '@/stores/cart'

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
</script>
