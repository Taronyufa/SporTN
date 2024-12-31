<template>
    <header class="bg-blue-500 text-white p-4 w-full">
        <div class="w-full mx-auto flex justify-between items-center">
            <!-- Logo or Title -->
            <div>
                <router-link to="/" ><h1 class="text-2xl font-bold text-white">SporTN</h1></router-link>
            
            </div>
    
            <!-- Navigation Links -->
            <nav class="flex gap-4">
                <router-link to="/my-bookings" class="text-white">Le Mie Prenotazioni</router-link>
                <router-link to="/fields" class="text-white">Prenota un Campo</router-link>
                <router-link to="/public-events" class="text-white">Eventi Pubblici</router-link>
                <router-link v-if="user.admin" to="/reports" class="text-white">Tutti i Report</router-link>
            </nav>
    
            <!-- User Options -->
            <div>
            <template v-if="!loggedUser.token">
                <router-link to="/login" class="btn btn-primary">Login</router-link>
            </template>
            <template v-else>
                <router-link to="/profile" class="btn btn-secondary">Profilo</router-link>
            </template>
            </div>
        </div>
    </header>
</template>

<script setup>
import { computed } from 'vue';
import user from '../states/user'; // Import user state

// Determine login status using computed properties
const loggedUser = computed(() => user);
</script>

<style scoped>
</style>
