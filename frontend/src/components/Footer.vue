<template>
    <footer class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <!-- Navigation Links -->
        <nav class="flex gap-4 mb-4 md:mb-0">
          <router-link to="/" class="hover:underline">Home</router-link>
          <router-link to="/my-bookings" class="hover:underline">Mie Prenotazioni</router-link>
          <router-link to="/book-field" class="hover:underline">Prenota un Campo</router-link>
          <router-link to="/public-events" class="hover:underline">Eventi Pubblici del Comune</router-link>
        </nav>
  
        <!-- Credits Section -->
        <div class="text-sm text-gray-400">
          <p>Made with ❤️ by SteLisTom </p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  /* No additional logic needed for this static footer */
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
  }
  </style>
  