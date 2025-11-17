<template>
  <div>
    <Header />
    <div class="min-h-[80vh]">
      <RouterView />
    </div>
    <Footer />
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>
