<template>
    <div class="container mx-auto p-6">
        <!-- Field Information -->
        <div v-if="field" class="flex flex-col md:flex-row items-center bg-white shadow-md rounded-lg mb-6 p-4">
            <div  class="flex-1 md:pr-4">
                <h1 class="text-3xl font-bold">{{ field.nome }}</h1>
                <p class="text-gray-600 mb-2">Indirizzo: {{ field.indirizzo }}</p>
                <p class="text-gray-600 mb-2">Sport supportati: {{ field.sport_supportati.join(', ') }}</p>
            </div>
            <!-- Field Picture -->
            <div class="w-full md:w-1/3 mt-4 md:mt-0">
                <img 
                :src="field.foto_url" 
                :alt="field.name" 
                class="w-full h-48 object-cover rounded-lg"
                />
            </div>
        </div>

        <!-- Future Reservations -->
        <div class="bg-white shadow-md rounded-lg p-4 mb-6">
            <h2 class="text-2xl font-bold mb-4">Prossime prenotazioni</h2>
            <ul>
            <li
                v-for="reservation in futureReservations"
                :key="reservation.id"
                class="mb-2 text-gray-700"
            >
                <strong>{{ reservation.data }}:</strong> {{ reservation.ora_inizio }} - {{ reservation.ora_fine }} 
                ({{ reservation.n_partecipanti }} participants). Sport: {{ reservation.sport }}. 
                {{ reservation.pubblico ? 'Sta cercando altri giocatori.' : '' }}
            </li>
            </ul>
            <p v-if="!futureReservations.length" class="text-gray-500">Nessuna prenotazione per questo campo.</p>
        </div>

        <!-- Reservation Form -->
        <div v-if="field" class="bg-white shadow-md rounded-lg p-4">
            <h2 class="text-2xl font-bold mb-4">Reserve This Field</h2>
            <form @submit.prevent="makeReservation">
                <!-- Date -->
                <div class="mb-4">
                    <label for="date" class="block text-gray-700 font-medium mb-2">Date</label>
                    <input
                    id="date"
                    v-model="reservationDate"
                    type="date"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <!-- Start Time -->
                <div class="mb-4">
                    <label for="startTime" class="block text-gray-700 font-medium mb-2">Start Time</label>
                    <input
                    id="startTime"
                    v-model="startTime"
                    type="time"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <!-- End Time -->
                <div class="mb-4">
                    <label for="endTime" class="block text-gray-700 font-medium mb-2">End Time</label>
                    <input
                    id="endTime"
                    v-model="endTime"
                    type="time"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <!-- Number of Participants -->
                <div class="mb-4">
                    <label for="participants" class="block text-gray-700 font-medium mb-2">Number of Participants</label>
                    <input
                    id="participants"
                    v-model.number="participants"
                    type="number"
                    min="1"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                </div>

                <!-- Sport -->
                <div class="mb-4">
                    <label for="sport" class="block text-gray-700 font-medium mb-2">Sport</label>
                    <select
                    id="sport"
                    v-model="selectedSport"
                    class="w-full p-3 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    >
                    <option v-for="sport in field.sport_supportati" :key="sport" :value="sport">{{ sport }}</option>
                    </select>
                </div>

                <!-- Searching for Other Players -->
                <div class="mb-4 flex items-center">
                    <input
                    id="searching"
                    v-model="is_public"
                    type="checkbox"
                    class="mr-2"
                    />
                    <label for="searching" class="text-gray-700 font-medium">Actively Searching for Other Players</label>
                </div>

                <!-- Submit Button -->
                <button
                    type="submit"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    Reserve Field
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import user from '../states/user';
    
    const route = useRoute();
    const router = useRouter();
    
    const field = ref(null);
    const futureReservations = ref([]);
    const reservationDate = ref('');
    const startTime = ref('');
    const endTime = ref('');
    const participants = ref(0);
    const selectedSport = ref('');
    const is_public = ref(false);
    
    async function fetchFieldDetails(fieldId) {
        try {
            const response = await fetch(`http://localhost:3000/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            field.value = await response.json();
        } catch (error) {
            console.error('Error fetching field details:', error);
        }
    }
    
    async function fetchFutureReservations(fieldId) {
        try {
            const response = await fetch(`http://localhost:3000/api/reservations`);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            futureReservations.value = await response.json();

            // Filter reservations for the current field
            futureReservations.value = futureReservations.value.filter(
                (reservation) => reservation.id_campo === fieldId && new Date(reservation.data) >= new Date()
            );

        } catch (error) {
            console.error('Error fetching reservations:', error);
        }
    }
    
    async function makeReservation() {
        if (!user.token) {
            alert('You need to be logged in to make a reservation.');
            router.push('/login');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:3000/api/reservations`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    field_id: route.params.id,
                    date: reservationDate.value,
                    start_time: startTime.value,
                    end_time: endTime.value,
                    participants: participants.value,
                    is_public: is_public.value,
                    sport: selectedSport.value,
                }),
            });
        
            if (!response.ok) {
                console.error('Error making reservation:', response);
                throw new Error('Failed to reserve the field. Please try again.');
            }

            // redirect to the reservation page
            router.push(`/my-bookings/`);

            fetchFutureReservations(field.value.id); // Refresh reservations
        } catch (error) {
            alert('Failed to reserve the field. Please check the form and try again.');
            console.error('Error reserving field:', error);
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
        fetchFutureReservations(fieldId);

        document.title = 'SporTN - Prenota Campo';
    });
</script>
