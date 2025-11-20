<template>
  <div class="container mx-auto p-4">
    <div v-if="loading" class="flex items-center justify-center h-40">
      <span class="loading loading-dots text-primary"></span>
    </div>

    <div v-else-if="product" class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <!-- Images -->
      <div class="md:col-span-1">
        <div class="card bg-base-200 p-4">
          <img
            :src="getImageUrl(activeImage)"
            :alt="product.name"
            class="w-full h-72 object-cover rounded-lg"
          />

          <div class="flex gap-2 mt-3">
            <button
              v-for="(img, idx) in images"
              :key="idx"
              @click="activeImage = img"
              :class="[
                'rounded-md overflow-hidden border',
                activeImage === img ? 'ring ring-primary' : 'border-transparent',
              ]"
              class="w-20 h-20"
            >
              <img
                :src="getImageUrl(img)"
                :alt="product.name + '-' + idx"
                class="w-full h-full object-cover"
              />
            </button>
          </div>
        </div>
      </div>

      <!-- Details -->
      <div class="md:col-span-2">
        <div class="card bg-base-200 p-6">
          <h1 class="text-2xl font-bold mb-2">{{ product.name }}</h1>
          <p class="text-3xl text-primary font-semibold mb-4">{{ formattedPrice }}</p>
          <p class="text-base-content/80 mb-6">{{ product.description }}</p>

          <div class="flex items-center gap-3">
            <button @click="addToCart(product.id)" class="btn btn-primary">
              Ajouter au panier
            </button>
            <button @click="showAlert" class="btn btn-ghost">Ajouter à la liste de souhaits</button>
          </div>
          <Alert v-if="showingAlert" message="La fonctionnalité n'est pas encore implémentée." />
        </div>

        <!-- Related products -->
        <section class="mt-8">
          <h2 class="text-xl font-semibold mb-4">Cela peut vous intéresser</h2>

          <div v-if="relatedLoading" class="flex items-center gap-2">
            <span class="loading loading-spinner"></span>
            <span>Chargement...</span>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card v-for="p in relatedProducts" :key="p.id" :product="p" />
            <div v-if="relatedProducts.length === 0" class="text-sm text-muted">
              Aucun autre produit disponible.
            </div>
          </div>
        </section>
      </div>
    </div>

    <div v-else class="text-center text-muted">Produit non trouvé.</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import type { Product } from '@/types/product'
import { productService } from '@/services/productService'
import Card from '@/components/Card.vue'
import Alert from '@/components/Alert.vue'
import { useCartStore } from '@/stores/cart'
import router from '@/router'

const route = useRoute()

const product = ref<Product | null>(null)
const loading = ref(true)

const relatedProducts = ref<Product[]>([])
const relatedLoading = ref(false)

const activeImage = ref<string>('')

const showingAlert = ref(false)
function showAlert() {
  showingAlert.value = true
  setTimeout(() => {
    showingAlert.value = false
  }, 3000)
}
function addToCart(productId: string) {
  const cartStore = useCartStore()
  cartStore.addToCart(productId)
  // redirect to cart page
  router.push({ name: 'cart' })
}

function getImageUrl(path: string | undefined) {
  if (!path) return ''
  // If the path includes leading "public/" (as provided), strip it so Vite/public assets resolve correctly
  return path.replace(/^public\//, '/')
}

const images = computed(() => {
  if (!product.value) return []
  return [
    product.value.image,
    product.value.image2,
    product.value.image3,
    product.value.image4,
  ].filter(Boolean)
})

const formattedPrice = computed(() => {
  if (!product.value) return ''
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(
    product.value.price,
  )
})

async function loadProductAndRelated(id: string) {
  if (!id) {
    product.value = null
    loading.value = false
    return
  }

  loading.value = true
  try {
    product.value = await productService.fetchProductById(id)
    activeImage.value = product.value?.image ?? ''
  } catch (e) {
    console.error(e)
    product.value = null
  } finally {
    loading.value = false
  }

  relatedLoading.value = true
  try {
    const all = await productService.fetchProducts()
    // exclude current and limit to 8
    relatedProducts.value = all.filter((p) => p.id !== id).slice(0, 8)
  } catch (e) {
    console.error('Erreur récupération produits liés', e)
    relatedProducts.value = []
  } finally {
    relatedLoading.value = false
  }
}

onMounted(() => {
  const id = String(route.params.id ?? '')
  void loadProductAndRelated(id)
})

watch(
  () => route.params.id,
  (newId, oldId) => {
    const id = String(newId ?? '')
    if (!id) {
      product.value = null
      return
    }
    if (String(oldId ?? '') === id) return
    void loadProductAndRelated(id)
  },
)
</script>

<style scoped>
.loading-spinner {
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 9999px;
}
</style>
