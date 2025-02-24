<template>
    <div class="container mx-auto p-6">
        <div v-if="event" class="bg-white shadow-md rounded-lg p-6">
            <!-- Event Details -->
            <h1 class="text-3xl font-bold mb-4">{{ event.nome }}</h1>
            <p class="text-gray-600 mb-2"><strong>Data e Ora Inizio:</strong> {{ formatDateTime(event.data_inizio) }}</p>
            <p class="text-gray-600 mb-2"><strong>Data e Ora Fine:</strong> {{ formatDateTime(event.data_fine) }}</p>
            <p class="text-gray-600 mb-2"><strong>Posizione:</strong> {{ event.posizione }}</p>
            <p class="text-gray-600 mb-2"><strong>Descrizione:</strong> {{ event.descrizione }}</p>
            
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
    import { format } from 'date-fns';
    
    const API_URL = import.meta.env.VITE_API_HOST;

    const route = useRoute();
    const router = useRouter();
    
    const event = ref(null);
    
    async function fetchEventDetails(eventId) {
        try {
            const response = await fetch(API_URL + `/events/${eventId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch event details.');
            }
        
            event.value = await response.json();

            document.title = `SporTN - ${event.value.nome}`;
        } catch (error) {
            console.error('Error fetching event details:', error);
            router.push('/public-events'); // Redirect to public events if unable to fetch
        }
    }

    function formatDateTime(dateTimeString) {
        return format(new Date(dateTimeString), 'dd/MM/yyyy HH:mm');
    }
    
    onMounted(() => {
        const eventId = route.params.id;
        fetchEventDetails(eventId);

        document.title = 'SporTN - Evento Pubblico';
    });
</script>
