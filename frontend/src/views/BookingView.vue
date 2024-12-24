<template>
    <div class="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Reservation Details -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Dettagli della Prenotazione</h1>
            <p class="text-gray-600 mb-2"><strong>Data:</strong> {{ reservation.data }}</p>
            <p class="text-gray-600 mb-2"><strong>Ora:</strong> {{ reservation.ora_inizio }} - {{ reservation.ora_fine }}</p>
            <p class="text-gray-600 mb-2"><strong>Numero Partecipanti:</strong> {{ reservation.n_partecipanti }}</p>
            <p class="text-gray-600 mb-2"><strong>Sport:</strong> {{ reservation.sport }}</p>
    
            <!-- Action Buttons -->
            <div v-if="isUserReservation" class="mt-4">
                <button
                    class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition mb-2 mr-2"
                    @click="showDeleteModal = true"
                >
                    Delete Reservation
                </button>
                <button
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-2 mr-2"
                    @click="goToReview"
                >
                    Leave a Review
                </button>
                <button
                    class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition"
                    @click="goToReport"
                >
                    Make a Report
                </button>
            </div>
        </div>

        <!-- Field Details -->
        <div class="bg-white shadow-md rounded-lg p-4">
            <h1 class="text-2xl font-bold mb-4">Dettagli del Campo</h1>
            <img
            :src="field.foto_url"
            :alt="field.nome"
            class="w-full h-48 object-cover rounded-lg mb-4"
            />
            <p class="text-gray-600 mb-2"><strong>Nome:</strong> {{ field.nome }}</p>
            <p class="text-gray-600 mb-2"><strong>Indirizzo:</strong> {{ field.indirizzo }}</p>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white rounded-lg shadow-md p-6 w-96">
                <h2 class="text-xl font-bold mb-4">Delete Reservation</h2>
                <p class="text-gray-700 mb-6">Are you sure you want to delete this reservation?</p>
                <div class="flex justify-end">
                    <button
                        class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition mr-2"
                        @click="showDeleteModal = false"
                    >
                        Cancel
                    </button>
                    <button
                        class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        @click="deleteReservation"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';
    import { useRoute, useRouter } from 'vue-router';
    import { computed } from "vue";
    import user from '../states/user';
    
    const route = useRoute();
    const router = useRouter();
    
    var reservation = ref({});
    var field = ref({});
    const showDeleteModal = ref(false); // State for showing the delete modal
    
    // Check if the logged user made the reservation
    var isUserReservation = false;
    
    async function fetchReservationDetails(reservationId) {
        try {
            const response = await fetch(`http://localhost:3000/api/reservations/${reservationId}`, {
                headers: {
                Authorization: `Bearer ${user.token}`,
                },
            });
        
            if (!response.ok) {
                throw new Error('Failed to fetch reservation details.');
            }
        
            reservation = await response.json();

            // Check if the logged user made the reservation
            isUserReservation = reservation.utente === user.user_id;

        } catch (error) {
            console.error('Error fetching reservation:', error);
            // router.push('/my-reservations'); // Redirect if unable to fetch
        }
    }
    
    async function fetchFieldDetails(fieldId) {
        try {
            const response = await fetch(`http://localhost:3000/api/fields/${fieldId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch field details.');
            }
        
            field.value = await response.json();
        } catch (error) {
            console.error('Error fetching field:', error);
        }
    }
    
    async function deleteReservation() {
        try {
            const response = await fetch(`http://localhost:3000/api/reservations/${reservation._id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete reservation.');
            }

            router.push('/my-bookings'); // Redirect after deletion
        } catch (error) {
            console.error('Error deleting reservation:', error);
        } finally {
            showDeleteModal.value = false; // Close modal
        }
    }

    
    function goToReview() {
        router.push(`/fields/${reservation.campo}/review`);
    }
    
    function goToReport() {
        router.push(`/fields/${reservation.campo}/report`);
    }
    
    onMounted(() => {
        if (!user.token) {
            alert('You need to be logged in to access this page.');
            router.push('/login');
            return;
        }

        const reservationId = route.params.id;
        fetchReservationDetails(reservationId).then(() => {
        if (reservation) {
            fetchFieldDetails(reservation.campo);
        }
        });
    });
</script>
