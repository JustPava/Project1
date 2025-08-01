import { defineStore } from 'pinia';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: [
  
      { date: '2025-08-15', time: '19:00', tables: 2 },
      { date: '2025-08-15', time: '20:00', tables: 1 },
    ],
    totalTables: 10, 
  }),
  getters: {
    isAvailable: (state) => (date, time, guests) => {
      const tablesNeeded = Math.ceil(guests / 4); 
      const bookedTablesOnDateTime = state.bookings
        .filter((booking) => booking.date === date && booking.time === time)
        .reduce((acc, booking) => acc + booking.tables, 0);

      return state.totalTables - bookedTablesOnDateTime >= tablesNeeded;
    },
  },
  actions: {
    addBooking(bookingDetails) {
      return new Promise((resolve, reject) => {
        const tablesNeeded = Math.ceil(bookingDetails.guests / 4);
        if (this.isAvailable(bookingDetails.date, bookingDetails.time, bookingDetails.guests)) {
          this.bookings.push({
            date: bookingDetails.date,
            time: bookingDetails.time,
            tables: tablesNeeded,
          });
          resolve('Столик успешно забронирован');
        } else {
          reject('К сожалению, на выбранное время все столики заняты.');
        }
      });
    },
  },
});