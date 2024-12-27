<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">Eventi Pubblici</h1>
    
        <!-- Events List -->
        <div v-if="events.length" class="bg-white shadow-md rounded-lg p-4">
            <div v-for="event in events" :key="event.id" class="flex items-center justify-between border-b py-4">
                <!-- Event Details -->
                <div>
                    <h2 class="text-xl font-bold">{{ event.nome }}</h2>

                    <!-- if the start and end date are different -->
                    <p class="text-gray-600">{{ event.data_inizio }} - {{ event.data_fine }}</p>
                    <p class="text-gray-600">Posizione: {{ event.posizione }}</p>
                </div>
        
                <!-- Join Button -->
                <button
                    @click="navigateToEvent(event._id)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Maggiori Informazioni
                </button>
            </div>
        </div>
    
        <!-- No Events Message -->
        <p v-else class="text-center text-gray-500">Nessun evento pubblico disponibile al momento.</p>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    const router = useRouter();

    
    const events = ref([]); // Store all events
    
    async function fetchEvents() {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            if (!response.ok) {
                throw new Error(`Failed to fetch events: ${response.status}`);
            }
        
            events.value = await response.json();
        } catch (error) {
            console.error('Error fetching public events:', error);
        }
    }

    async function navigateToEvent(eventId) {
        // Redirect to the event details page
        router.push(`/public-events/${eventId}`);
    }
    
    onMounted(() => {
        fetchEvents();

        document.title = 'SporTN - Eventi Pubblici';
    });
</script>
