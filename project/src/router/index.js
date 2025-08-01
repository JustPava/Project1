import { createRouter, createWebHistory } from 'vue-router';
import BookingForm from '../components/BookingForm.vue';

const routes = [
  {
    path: '/',
    name: 'BookingForm',
    component: BookingForm,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;