<template>
    <div class="container mx-auto p-6">
        <h1 class="text-3xl font-bold text-center mb-6">Le Tue Prenotazioni</h1>
    
        <!-- Future Reservations -->
        <section v-if="futureReservations.length" class="mb-12">
            <h2 class="text-2xl font-bold mb-4">Prossime Prenotazioni</h2>
            <div v-for="reservation in futureReservations" :key="reservation._id" class="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg mb-6 p-4 flex-1 md:pr-4 cursor-pointer hover:bg-gray-100" @click="navigateToBooking(reservation._id)">
                <!-- Reservation Details -->
                <div>
                    <h3 class="text-xl font-bold mb-2">{{ reservation.nome_campo }}</h3>
                    <p class="text-gray-600 mb-2">Data: {{ formatDate(reservation.data) }}</p>
                    <p class="text-gray-600 mb-2">Ora: {{ reservation.ora_inizio }} - {{ reservation.ora_fine }}</p>
                    <p class="text-gray-600 mb-2">Partecipanti: {{ reservation.n_partecipanti }}</p>
                    <p class="text-gray-600">Sport: {{ reservation.sport }}</p>
                </div>
            </div>
        </section>

        <!-- Past Reservations -->
        <section v-if="pastReservations.length">
            <h2 class="text-2xl font-bold mb-4">Prenotazioni Passate</h2>
            <div v-for="reservation in pastReservations" :key="reservation._id" class="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg mb-6 p-4 flex-1 md:pr-4 cursor-pointer hover:bg-gray-100" @click="navigateToBooking(reservation._id)">
                <!-- Reservation Details -->
                <div class="">
                    <h3 class="text-xl font-bold mb-2">{{ reservation.nome_campo }}</h3>
                    <p class="text-gray-600 mb-2">Data: {{ formatDate(reservation.data) }}</p>
                    <p class="text-gray-600 mb-2">Ora: {{ reservation.ora_inizio }} - {{ reservation.ora_fine }}</p>
                    <p class="text-gray-600 mb-2">Partecipanti: {{ reservation.n_partecipanti }}</p>
                    <p class="text-gray-600">Sport: {{ reservation.sport }}</p>
                </div>
            </div>
        </section>

        <!-- No Reservations -->
        <p v-if="!futureReservations.length && !pastReservations.length" class="text-gray-500 text-center">
            Non hai ancora effettuato nessuna prenotazione.
        </p>
    </div>
</template>


<script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import user from '../states/user';
    import { format } from 'date-fns';

    const API_URL = import.meta.env.VITE_API_HOST;
    
    const router = useRouter();
    
    const futureReservations = ref([]);
    const pastReservations = ref([]);
    
    async function fetchUserReservations() {
        if (!user.token) {
        alert('You need to be logged in to access this page.');
        router.push('/login');
        return;
        }
    
        try {
            const response = await fetch(API_URL + `/reservations?user_id=${user.user_id}`, {
            method: 'GET',
            headers: {
            Authorization: `Bearer ${user.token}`,
            },
        });
    
        if (!response.ok) {
            throw new Error('Failed to fetch reservations.');
        }
    
        const reservations = await response.json();
    
        // Separate reservations into future and past
        const now = new Date();
        futureReservations.value = reservations
            .filter(res => new Date(res.data) >= now)
            .sort((a, b) => new Date(a.data) - new Date(b.data));
        pastReservations.value = reservations
            .filter(res => new Date(res.data) < now)
            .sort((a, b) => new Date(b.data) - new Date(a.date));
        } catch (error) {
        console.error('Error fetching reservations:', error);
        }
    }

    function navigateToBooking(bookingId) {
        router.push(`/bookings/${bookingId}`);
    }

    function formatDate(dateString) {
        return format(new Date(dateString), 'dd/MM/yyyy');
    }
    
    onMounted(() => {
        fetchUserReservations();

        document.title = 'SporTN - Le Tue Prenotazioni';
    });
</script>
