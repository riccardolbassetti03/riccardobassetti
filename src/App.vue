<template>

  <div id="app">
    <Navbar v-if="!isGalleryPage" />
    <router-view />
  </div>

</template>

<script>
import Navbar from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  computed: {
    isGalleryPage() {
      return this.$route.path === '/';
    }
    }
}
</script>

<style>
/* Stili globali che riguardano tutta la pagina */
html, body, #app {
  margin: 0;
  padding: 0;
  background-color: #F8F5F0;
  overflow: visible; /* o visible, se ti serve */
  height: 100%;
   font-family: 'Inter', sans-serif;
}

/* bottoni globali */
/* font globale */
</style>

