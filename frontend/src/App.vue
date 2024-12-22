<template>
  <div class="min-h-screen flex flex-col w-full">
    <Header />
    <main class="flex-1 p-4 bg-gray-100 w-full">
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
</script>

<style>
/* Full width and height for main content */
body, html {
  width: 100%;
  height: 100%;
}

.main-container {
  width: 100%;
  height: 100%;
}
</style>
