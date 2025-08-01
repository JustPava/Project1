<template>
  <div class="booking-form-container">
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="date">Дата:</label>
        <input type="date" id="date" v-model="date" :min="today" required />
      </div>

      <div class="form-group">
        <label for="time">Время:</label>
        <select id="time" v-model="time" required>
          <option value="">Выберите время</option>
          <option v-for="timeSlot in timeSlots" :key="timeSlot" :value="timeSlot">
            {{ timeSlot }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="guests">Количество человек:</label>
        <input type="number" id="guests" v-model.number="guests" min="1" max="20" required />
      </div>

      <div class="availability-check" v-if="isChecking">
        <p>Проверяем наличие свободных столиков...</p>
      </div>
      
      <BookingStatus v-if="statusMessage" :message="statusMessage" :type="statusType" />

      <button type="submit" :disabled="!isFormValid || isSubmitting">
        {{ isSubmitting ? 'Бронирование...' : 'Забронировать' }}
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useBookingStore } from '../store';
import BookingStatus from './BookingStatus.vue';

const date = ref('');
const time = ref('');
const guests = ref(1);

const statusMessage = ref('');
const statusType = ref(''); // 
const isSubmitting = ref(false);
const isChecking = ref(false);

const bookingStore = useBookingStore();
const today = computed(() => {
  return new Date().toISOString().split('T')[0];
});


const timeSlots = computed(() => {
  const slots = [];
  for (let hour = 12; hour <= 22; hour++) {
    slots.push(`${hour}:00`);
    if (hour < 22) {
      slots.push(`${hour}:30`);
    }
  }
  return slots;
});


const isFormValid = computed(() => {
  return date.value && time.value && guests.value > 0;
});




watch([date, time, guests], async ([newDate, newTime, newGuests]) => {
  
  statusMessage.value = '';
  if (newDate && newTime && newGuests > 0) {
    isChecking.value = true;
   
    await new Promise(res => setTimeout(res, 500)); 
    
    const available = bookingStore.isAvailable(newDate, newTime, newGuests);
    if (!available) {
      statusMessage.value = 'На выбранные дату и время нет свободных мест.';
      statusType.value = 'error';
    }
    isChecking.value = false;
  }
});



const handleSubmit = async () => {
  if (!isFormValid.value) return;

  isSubmitting.value = true;
  statusMessage.value = '';

  try {
    const message = await bookingStore.addBooking({
      date: date.value,
      time: time.value,
      guests: guests.value,
    });
    statusMessage.value = message;
    statusType.value = 'success';
  
    date.value = '';
    time.value = '';
    guests.value = 1;
  } catch (error) {
    statusMessage.value = error;
    statusType.value = 'error';
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<style scoped>
.booking-form-container {
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box; 
}

.availability-check p {
  margin: 1rem 0;
  color: #666;
  font-style: italic;
}

button {
  width: 100%;
  padding: 0.85rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>