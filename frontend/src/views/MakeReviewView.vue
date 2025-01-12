<template>
    <div class="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Review Form -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Scrivi una Recensione</h1>
            <form @submit.prevent="submitReview">
                <!-- Title -->
                <div class="mb-4">
                    <label for="title" class="block text-gray-700 font-medium mb-2">Titolo</label>
                    <input
                    id="title"
                    v-model="title"
                    type="text"
                    placeholder="Inserisci il titolo della recensione"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>
        
                <!-- Rating -->
                <div class="mb-4">
                    <label for="rating" class="block text-gray-700 font-medium mb-2">Punteggio</label>
                    <select
                    id="rating"
                    v-model="rating"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                    <option v-for="n in 6" :key="n" :value="n-1">{{ n-1 }} Stell{{ n-1 == 1 ? 'a' : 'e' }}</option>
                    </select>
                </div>
        
                <!-- Description -->
                <div class="mb-4">
                    <label for="description" class="block text-gray-700 font-medium mb-2">Descrizione</label>
                    <textarea
                    id="description"
                    v-model="description"
                    placeholder="Scrivi la tua recensione qui"
                    rows="4"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    ></textarea>
                </div>
        
                <!-- Submit Button -->
                <button
                    type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Invia Recensione
                </button>
            </form>
        </div>
  
        <!-- Field Details -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Dettagli del Campo</h1>
            <p class="text-gray-600 mb-2"><strong>Nome:</strong> {{ field.nome }}</p>
            <p class="text-gray-600 mb-2"><strong>Indirizzo:</strong> {{ field.indirizzo }}</p>
            <img
            :src="field.foto_url"
            :alt="field.name"
            class="w-full h-48 object-cover rounded-lg mb-4"
            />
        </div>
    </div>
</template>
  
<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import user from '../states/user';
    
    const API_URL = import.meta.env.VITE_API_HOST;

    const route = useRoute();
    const router = useRouter();
    
    const field = ref({});
    const title = ref('');
    const rating = ref(0);
    const description = ref('');
    
    async function fetchFieldDetails(fieldId) {
        try {
            const response = await fetch(API_URL + `/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch field details.');
            }
        
            field.value = await response.json();
        } catch (error) {
            console.error('Error fetching field details:', error);
        }
    }
    
    async function submitReview() {
        if (!user.token) {
            alert('You need to be logged in to submit a review.');
            router.push('/login');
            return;
        }
    
        if (!title.value || !description.value) {
            alert('Please fill in all fields.');
            return;
        }
    
        try {
            const response = await fetch(API_URL + `/reviews`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    field_id: route.params.id,
                    title: title.value,
                    rating: rating.value,
                    description: description.value,
                }),
            });
        
            if (!response.ok) {
                throw new Error('Failed to submit review.');
            }
        
            alert('Review submitted successfully!');
            router.push(`/my-bookings`);
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }
    
    onMounted(() => {
        if (!user.token) {
            alert('You need to be logged in to access this page.');
            router.push('/login');
            return;
        }
    
        const fieldId = route.params.id;
        fetchFieldDetails(fieldId);

        document.title = 'SporTN - Scrivi Recensione';
    });
</script>
