import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import MyBookings from '../views/MyBookingsView.vue';
import Booking from '../views/BookingView.vue';
import MakeBooking from '../views/MakeBookingView.vue';
import MakeReview from '../views/MakeReviewView.vue';
import MakeReport from '../views/MakeReportView.vue';
import Fields from '../views/FieldsView.vue';
import PublicEvents from '../views/PublicEventsView.vue';
import PublicEvent from '../views/PublicEventView.vue';
import Login from '../views/LoginView.vue';
import Register from '../views/RegisterView.vue';
import Profile from '../views/ProfileView.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookings },
  { path: '/bookings/:id', name: 'Booking', component: Booking },
  { path: '/book-field/:id', name: 'MakeBooking', component: MakeBooking },
  { path: '/fields/:id/review', name: 'MakeReview', component: MakeReview },
  { path: '/fields/:id/report', name: 'MakeReport', component: MakeReport },
  { path: '/fields', name: 'Fields', component: Fields },
  { path: '/public-events', name: 'PublicEvents', component: PublicEvents },
  { path: '/public-events/:id', name: 'PublicEvent', component: PublicEvent },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
