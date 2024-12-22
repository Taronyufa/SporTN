<script setup>
  import { ref, onMounted } from 'vue';
  import user  from '../states/user';

  const events = ref([]);

  async function fetchMyBookings() {
    // get the user id from the user state
    const user_id = user.value.id;

    if (!user_id) {
      // user is not logged in
      return [];
    }

    try {
      const response = await fetch(`http://localhost:3000/api/reservations?user_id=${user_id}`);
      my_bookings.value = await response.json();
      my_bookings.value = {
        id: 1,
        name: 'Campo di calcetto',
        date: '2022-01-01',
        location: 'Trento',
      }
    } catch (error) {
      console.error('Error fetching my bookings:', error);
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

  onMounted(() => {
    fetchEvents();
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
      <h2 v-if="!user.username" class="text-2xl font-semibold mb-4">Esegui il login per vedere le tue prenotazioni</h2>
      <h2 v-if="user.username" class="text-2xl font-semibold mb-4">Le Mie Prenotazioni</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <li v-for="booking in my_bookings" :key="booking.id" class="bg-white rounded-lg shadow p-4">
          <h3 class="text-xl font-semibold">{{ booking.name }}</h3>
          <p class="text-gray-600">Date: {{ booking.date }}</p>
          <p class="text-gray-600">Location: {{ booking.location }}</p>
          <!-- button to the reservation page -->
          <router-link
            class="btn btn-primary mt-4"
            :to="'/bookings/' + booking.id"
          >
            View Booking
          </router-link>
        </li>
      </ul>
    </section>
    

    <!-- Bookings that are searching other people -->
    <!-- request to /api/reservations?public_only=true -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Trova altre persone con cui giocare</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <li v-for="public_reservation in public_reservations" :key="public_reservation.id" class="bg-white rounded-lg shadow p-4">
          <h3 class="text-xl font-semibold">{{ public_reservation.name }}</h3>
          <p class="text-gray-600">Date: {{ public_reservation.date }}</p>
          <p class="text-gray-600">Location: {{ public_reservation.location }}</p>
          <button
            class="btn btn-primary mt-4"
            @click="joinEvent(event.id)"
          >
            Join Event
          </button>
        </li>
      </ul>
    </section>

    <!-- Public Events -->
    <section>
      <h2 class="text-2xl font-semibold mb-4">Eventi Pubblici</h2>
      <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <li v-for="event in events" :key="event.id" class="bg-white rounded-lg shadow p-4">
          <h3 class="text-xl font-semibold">{{ event.name }}</h3>
          <p class="text-gray-600">Date: {{ event.date }}</p>
          <p class="text-gray-600">Location: {{ event.location }}</p>
        </li>
      </ul>
    </section>




  </div>
</template>
  
