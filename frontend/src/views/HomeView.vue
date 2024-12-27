<script setup>
    import { ref, onMounted } from 'vue';
    import user  from '../states/user';
    import { useRouter } from 'vue-router';

    const my_bookings = ref([]);
    const public_reservations = ref([]);
    const events = ref([]);
    const router = useRouter();

    async function fetchMyBookings() {
        // get the user id from the user state
        const user_id = user.user_id;

        if (!user_id) {
            // user is not logged in
            return [];
        }

        try {
            const response = await fetch(`http://localhost:3000/api/reservations?user_id=${user_id}`);
            my_bookings.value = await response.json();
        } catch (error) {
            console.error('Error fetching my bookings:', error);
        }
    }

    async function fetchPublicReservations() {
        try {
            const response = await fetch('http://localhost:3000/api/reservations?public_only=true');

            // remove the user's public reservations from the list
            const all_public_reservations = await response.json();
            public_reservations.value = all_public_reservations.filter(reservation => reservation.utente !== user.user_id);
        } catch (error) {
            console.error('Error fetching public reservations:', error);
        }
    }

    async function fetchEvents() {
        try {
            const response = await fetch('http://localhost:3000/api/events');
            events.value = await response.json();
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    function navigateToBooking(bookingId) {
        console.log('Navigating to booking:', bookingId);
        router.push(`/bookings/${bookingId}`);
    }

    function navigateToEvent(eventId) {
        console.log('Navigating to event:', eventId);
        router.push(`/public-events/${eventId}`);
    }

    onMounted(() => {
        fetchMyBookings();
        fetchPublicReservations();
        fetchEvents();

        document.title = 'SporTN - Home';
    });
</script>

<style scoped>
    .container {
        max-width: 1200px;
    }
</style>


<template>
    <div class="container mx-auto p-6">

        <h1 class="text-4xl font-bold text-center mb-6">Benvenuto su SporTN</h1>

        <!-- My Bookings -->
        <!-- request to /api/reservations?user_id=user_id -->
        <section>
        <h2 v-if="!user.token" class="text-2xl font-semibold mb-4">Esegui il login per vedere le tue prenotazioni</h2>
        <h2 v-if="user.token" class="text-2xl font-semibold mb-4">Le Tue Prenotazioni</h2>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li v-for="booking in my_bookings" :key="booking.id" class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100" @click="navigateToBooking(booking._id)">
            <h3 class="text-xl font-semibold">Campo: {{ booking.nome_campo }}</h3>
            <p class="text-gray-600">{{ booking.data }} dalle {{ booking.ora_inizio }} alle {{ booking.ora_fine }}</p>
            <p class="text-gray-600">Sport: {{ booking.sport }}</p>
            <p v-if="booking.pubblico" class="text-gray-600">Stai cercando attivamente compagni di gioco</p>
            <p v-if="!booking.pubblico" class="text-gray-600">Questa prenotazione è privata</p>
            </li>
        </ul>
        </section>

        <!-- Bookings that are searching other people -->
        <!-- request to /api/reservations?public_only=true -->
        <section>
        <h2 class="text-2xl font-semibold mb-4">Trova altre persone con cui giocare</h2>
        <p class="text-gray-600">Qui puoi trovare prenotazioni di altri utenti che cercano compagni di gioco</p>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li v-for="public_reservation in public_reservations" :key="public_reservation.id" class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100" @click="navigateToBooking(public_reservation._id)">
            <h3 class="text-xl font-semibold">Campo: {{ public_reservation.nome_campo }}</h3>
            <p class="text-gray-600">{{ public_reservation.data }} dalle {{ public_reservation.ora_inizio }} alle {{ public_reservation.ora_fine }}</p>
            <p class="text-gray-600">Sport: {{ public_reservation.sport }}</p>
            </li>
        </ul>
        </section>

        <!-- Public Events -->
        <!-- request to /api/events -->
        <section>
        <h2 class="text-2xl font-semibold mb-4">Eventi Pubblici</h2>
        <p class="text-gray-600">Qui puoi trovare eventi pubblici sportivi nella città di Trento</p>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <li
            v-for="event in events"
            :key="event.id"
            class="bg-white rounded-lg shadow p-4 cursor-pointer hover:bg-gray-100"
            @click="navigateToEvent(event._id)"
            >
            <h3 class="text-xl font-semibold">{{ event.nome }}</h3>
            <p class="text-gray-600">Data: {{ event.data_inizio }}</p>
            <p class="text-gray-600">Luogo: {{ event.posizione }}</p>
            </li>
        </ul>
        </section>
    </div>
</template>
