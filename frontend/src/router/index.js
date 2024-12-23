import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import MyBookings from '../views/MyBookingsView.vue';
import MyBooking from '../views/MyBookingView.vue';
import MakeBooking from '../views/MakeBookingView.vue';
import MakeReview from '../views/MakeReviewView.vue';
import MakeReport from '../views/MakeReportView.vue';
import Fields from '../views/FieldsView.vue';
import PublicEvents from '../views/PublicEventsView.vue';
import Login from '../views/LoginView.vue';
import Register from '../views/RegisterView.vue';
import Profile from '../views/ProfileView.vue';
import EditProfile from '../views/EditProfileView.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/my-bookings', name: 'MyBookings', component: MyBookings },
  { path: '/my-booking/:id', name: 'MyBooking', component: MyBooking },
  { path: '/book-field/:id', name: 'MakeBooking', component: MakeBooking },
  { path: '/make-review/:id', name: 'MakeReview', component: MakeReview },
  { path: '/make-report/:id', name: 'MakeReport', component: MakeReport },
  { path: '/fields', name: 'Fields', component: Fields },
  { path: '/public-events', name: 'PublicEvents', component: PublicEvents },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/profile', name: 'Profile', component: Profile },
  { path: '/edit-profile', name: 'EditProfile', component: EditProfile },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
