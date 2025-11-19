<script setup lang="ts">
import type { Product } from '@/types/product'

const props = defineProps<{ product?: Product }>()
</script>

<template>
  <div class="card card-sm bg-base-200 max-w-60 shadow">
    <figure class="hover-gallery">
      <img :src="props.product ? props.product.image : 'nothing'" />
      <img :src="props.product ? props.product.image2 : 'nothing'" />
      <img :src="props.product ? props.product.image3 : 'nothing'" />
      <img :src="props.product ? props.product.image4 : 'nothing'" />
    </figure>
    <div class="card-body">
      <h2 class="card-title flex justify-between">
        {{ props.product ? props.product.name : '????' }}
        <span class="font-normal">{{ props.product ? `$${props.product.price}` : '$??' }}</span>
      </h2>
      <p>
        {{ props.product ? props.product.description : '????' }}
      </p>
    </div>
  </div>
</template>
