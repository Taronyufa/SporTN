<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 class="text-2xl font-bold text-center mb-6">Register for SporTN</h1>
        
        <form @submit.prevent="register">
          <!-- Username Field -->
          <div class="mb-4">
            <label for="username" class="block text-gray-700 font-medium mb-2">Username</label>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Inserisci il tuo username"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
  
          <!-- Email Field -->
          <div class="mb-4">
            <label for="email" class="block text-gray-700 font-medium mb-2">Email</label>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Inserisci la tua email"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
  
          <!-- Password Field -->
          <div class="mb-4">
            <label for="password" class="block text-gray-700 font-medium mb-2">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Inserisci la tua password"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
  
          <!-- Confirm Password Field -->
          <div class="mb-4">
            <label for="confirmPassword" class="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              id="confirmPassword"
              v-model="confirmPassword"
              type="password"
              placeholder="Conferma la tua password"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
            />
          </div>
  
          <!-- Error Message -->
          <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
            {{ errorMessage }}
          </div>
  
          <!-- Register Button -->
          <button
            type="submit"
            class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
          >
            Registrati
          </button>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';

  const API_URL = import.meta.env.VITE_API_HOST;
  
  const username = ref('');
  const email = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const errorMessage = ref('');
  const router = useRouter();

  document.title = 'SporTN - Register';
  
  async function register() {
    if (password.value !== confirmPassword.value) {
      errorMessage.value = "Passwords do not match.";
      return;
    }
  
    try {
      const response = await fetch(API_URL + '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, email: email.value, password: password.value }),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed. Please try again.');
      }
  
      const data = await response.json();
      console.log('Registration successful:', data);
  
      // Redirect to login or another page
      router.push('/login');
    } catch (error) {
      errorMessage.value = error.message;
    }
  }
  </script>
