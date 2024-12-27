<template>
    <div class="container mx-auto p-6">
        <div v-if="event" class="bg-white shadow-md rounded-lg p-6">
            <!-- Event Details -->
            <h1 class="text-3xl font-bold mb-4">{{ event.nome }}</h1>
            <p class="text-gray-600 mb-2"><strong>Data e Ora Inizio:</strong> {{ event.data_inizio }}</p>
            <p class="text-gray-600 mb-2"><strong>Data e Ora Fine:</strong> {{ event.data_fine }}</p>
            <p class="text-gray-600 mb-2"><strong>Posizione:</strong> {{ event.posizione }}</p>
            <p class="text-gray-600 mb-2"><strong>Description:</strong> {{ event.descrizione }}</p>
            
            <!-- Event Image -->
            <img
            :src="event.foto_url"
            :alt="event.nome"
            class="w-full object-cover rounded-lg mb-6"
            />
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    
    const route = useRoute();
    const router = useRouter();
    
    var event = ref({});
    
    async function fetchEventDetails(eventId) {
        try {
            const response = await fetch(`http://localhost:3000/api/events/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event details.');
            }
        
            event = await response.json();

            document.title = `SporTN - ${event.nome}`;
        } catch (error) {
            console.error('Error fetching event details:', error);
            router.push('/public-events'); // Redirect to public events if unable to fetch
        }
    }
    
    onMounted(() => {
        const eventId = route.params.id;
        fetchEventDetails(eventId);

        document.title = 'SporTN - Evento Pubblico';
    });
</script>
