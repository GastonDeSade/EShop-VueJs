<template>
  <div class="">
    <div class="">
      <div class="">
        <h2 class="text-xl font-bold m-4 flex justify-center">Nos parfums</h2>
        <div
          class="grid grid-flow-row justify-items-center align-middle items-center justify-center md:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <Card
            v-for="(product, index) in products"
            :key="product.id ?? product.name ?? index"
            :product="product"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Card from '@/components/Card.vue'
import { productService } from '@/services/productService'
import { ref, onMounted } from 'vue'
import type { Product } from '@/types/product'

const products = ref<Product[]>([])

onMounted(async () => {
  products.value = await productService.fetchProducts()
})
</script>

<style scoped></style>
