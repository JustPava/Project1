<template>
  <div id="app">
    <header>
      <h1>Бронирование столика в кафе</h1>
    </header>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
@import './assets/styles.css';
</style>