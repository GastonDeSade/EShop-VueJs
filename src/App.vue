<template>
  <div class="min-h-screen flex flex-col">
    <header class="flex-none h-[10vh]">
      <Header />
    </header>

    <main class="flex-1 overflow-auto min-h-0 flex flex-col">
      <RouterView />
    </main>

    <footer class="flex-none h-[10vh]">
      <Footer />
    </footer>
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import Footer from '@/components/Footer.vue'
import Header from '@/components/Header.vue'
</script>
