<template>
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
        <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
            <h1 class="text-2xl font-bold text-center mb-6"> Effettua il Login </h1>
            
            <form @submit.prevent="login">
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
        
                <!-- Error Message -->
                <div v-if="errorMessage" class="text-red-500 text-sm mb-4">
                    {{ errorMessage }}
                </div>
        
                <!-- Login Button -->
                <button
                    type="submit"
                    class="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition"
                >
                    Login
                </button>
            </form>

            <p class="text-center mt-4">
                Non hai un account? <router-link to="/register" class="text-blue-500">Registrati</router-link>
            </p>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { useRouter } from 'vue-router';
    import { setUser } from '../states/user';

    const API_URL = import.meta.env.VITE_API_HOST;

    const email = ref('');
    const password = ref('');
    const errorMessage = ref('');
    const router = useRouter();

    document.title = 'SporTN - Login';

    async function login() {
        try {
            const response = await fetch(API_URL + '/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value, password: password.value }),
            });

            if (!response.ok) {
                throw new Error('Invalid email or password');
            }

            const data = await response.json();
            setUser(data); // Save user data in the state
            router.push('/'); // Redirect to homepage
        } catch (error) {
            errorMessage.value = error.message;
        }
    }
</script>
