<template>
  <div class="navbar-wrapper">
    <nav :class="['navbar', { 'no-bg': isGalleryPage || isGamePage }]">
      <div :class="['navbar-container container-fluid d-flex flex-wrap justify-content-between align-items-center', { 'no-bg': isGalleryPage }]">
        
        <!-- Logo -->
        <div class="logo">
          <router-link to="/home" class="brand-name">Orderly</router-link>
        </div>

        <!-- Navigation Links -->
        <ul class="navbar-links d-flex flex-wrap align-items-center mb-0" 
            :class="{ active: isOpen, 'disabled-links': isGamePage }">

          <li>
            <!-- Dropdown for "SHIP TO" -->
            <div class="dropdown">
              <button 
                  :class="['dropbtn', { 'no-bg': isGalleryPage || isGamePage, 'white-text': isGalleryPage }]">
                <span v-if="selectedCountry">
                  <img :src="selectedCountry.flag" alt="flag" class="flag" />
                  {{ selectedCountry.name }}
                </span>
                <span v-else class="ship-to">SHIP TO</span>
                <i class="arrow-down"></i>
              </button>
              <div class="dropdown-content">
                <a 
                  v-for="country in countries" 
                  :key="country.code" 
                  @click="selectCountry(country)"
                  :class="{ selected: selectedCountry && selectedCountry.code === country.code }"
                >
                  <img :src="country.flag" alt="flag" class="flag" />
                  {{ country.name }}
                </a>
              </div>
            </div>
          </li>

          <li>
            <router-link to="/login">LOGIN</router-link>
          </li>
          <li>
  <router-link to="/cart">
    CART <span v-if="cartItemCount > 0" class="cart-count">{{ cartItemCount }}</span>
  </router-link>
</li>
        </ul>

        <!-- Hamburger Menu -->
        <div 
          class="menu-toggle d-block" 
          @click="toggleMenu"
        >
          <div 
            :class="['bar', { 'open': isOpen, 'white-bars': isGalleryPage }]" 
            style="background-color: rgb(90, 50, 30);"
          ></div>
          <div 
            :class="['bar', { 'open': isOpen, 'white-bars': isGalleryPage }]" 
            style="background-color: rgb(90, 50, 30);"
          ></div>
          <div 
            :class="['bar', { 'open': isOpen, 'white-bars': isGalleryPage }]" 
            style="background-color: rgb(90, 50, 30);"
          ></div>
        </div>
      </div>
    </nav>

    <!-- Sidebar disabled on game page -->
    <AppSideBar v-if="!isGamePage" :isOpen="isOpen" @close="toggleMenu" />
  </div>
</template>


<script>
import AppSideBar from './AppSideBar.vue';
import { useCartStore } from '@/stores/cart';  // import store

export default {
  name: 'NavBar',
  components: {
    AppSideBar,
  },
  data() {
    return {
      isOpen: false,
      countries: [
        { code: 'IT', name: "ITALY", flag: require('@/assets/flags/italy.png') },
        { code: 'US', name: "UNITED STATES", flag: require('@/assets/flags/united-states.png') },
        { code: 'UK', name: "UNITED KINGDOM", flag: require('@/assets/flags/united-kingdom.png') },
        { code: 'DE', name: "GERMANY", flag: require('@/assets/flags/germany.png') },
        { code: 'FR', name: "FRANCE", flag: require('@/assets/flags/france.png') }
      ],
      selectedCountry: null,
      cartStore: null,
    };
  },
  computed: {
    cartItemCount() {
      return this.cartStore ? this.cartStore.itemCount : 0;  // getter per la quantità totale
    },
    isLoginOrRegisterPage() {
      return this.$route.path === '/login' || this.$route.path === '/register';
    },
    isLoginRegisterOrQuestionsPage() {
      return ['/login', '/register', '/questions'].includes(this.$route.path);
    },
    isHomePage() {
      return this.$route.path === '/home';
    },
    isGalleryPage() {
      return this.$route.path === '/gallery';
    },
    isGamePage() {
      return this.$route.path === '/capventure';
    }
  },
  watch: {
    '$route.path'(newPath) {
      if (newPath === '/game') {
        document.body.classList.add('game-page');
      } else {
        document.body.classList.remove('game-page');
      }
    }
  },
  methods: {
    selectCountry(country) {
      this.selectedCountry = country;
    },
    toggleMenu() {
      this.isOpen = !this.isOpen;  // Toggle the state of the sidebar
    }
  },
  mounted() {
    this.cartStore = useCartStore();
    // Set cursor state on initial load
    if (this.$route.path === '/game') {
      document.body.classList.add('game-page');
    }
  }
};
</script>

<style scoped>

.cart-count {
  background-color: rgba(1,1,1,0.7); /* o un colore a scelta */
  color: white;
  border-radius: 30%;
  padding: 2px 8px;
  font-size: 15px;
  font-weight: bold;
  margin-left: 6px;
  vertical-align: middle;
}


body.game-page {
  cursor: none;
}

.navbar.no-bg,
.navbar-container.no-bg {
  background-color: transparent !important; /* Platinum */
}

.dropbtn.no-bg {
  background-color: transparent !important;
}

.navbar-links.no-bg {
  background-color: transparent !important;
}

.white-text {
  color: #111111 !important; /* Jet */
  text-shadow: 1px 1px 4px #111111;
}

.white-text:hover {
  color: #F9AB55 !important; /* Sandy brown */
}

.white-bars {
  background-color: #D1DEDE !important; /* Platinum */
}

.ship-to {
  padding-top: 4px;
  color: #111111;
}

.dropdown {
  position: relative;
  margin-bottom: 3px;
  display: inline-block;
}

.menu-toggle:hover{
cursor: pointer;
}

.dropbtn {
  background-color: #F8F5F0; /* Platinum */
  color: #111111; /* Jet */
  font-size: 17px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-top: -1px;
}

.dropbtn .arrow-down {
  margin-left: 10px;
  border: solid #111111; /* Jet */
  border-width: 0 2px 2px 0;
  padding: 3px;
  transform: rotate(45deg);
}

.dropdown-content {
  display: none;
  position: absolute;
  background-color: #F8F5F0; /* Jet */
  min-width: 200px;
  box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.5);
  z-index: 1;
  flex-direction: column;
  padding: 5px 0;
  border: 1px solid rgba(0, 0, 0, 0.5); /* Platinum */
}

.dropdown-content a {
  color: #D1DEDE; /* Platinum */
  padding: 12px 16px;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.dropdown-content a:hover {
  cursor: pointer;
}

.dropdown:hover .dropdown-content {
  display: block;
}

.dropdown:hover .arrow-down {
  transform: rotate(-135deg);
}

.flag {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.navbar {
  background-color: #F8F5F0; /* Platinum */
  position: fixed;
  align-items: center;
  top: 0;
  height: 52px;
  width: 100%;
  z-index: 1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4); /* Ombra leggera per separare la navbar dalla main page */
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  width: 100%;
}

.logo {
  font-size: 24px;
  margin-top: 5px;
  margin-left: -20px;
}

.brand-name {
  font-size: 20px;
  font-weight: bold;
  font-style: italic;
  position: absolute;
  top: 10px;
  padding: 0 20px;
  color: rgba(17, 17, 17, 0.5); /* Jet */
  text-decoration: none;
}

.brand-name:hover{
  color: #F9AB55 !important;
}

.navbar-links {
  list-style: none;
  display: flex;
  align-items: center;
  margin-top: 2px;
  gap: 10px;
  padding: 0 20px;
  justify-content: flex-end;
  width: 100%;
  margin-left: auto;
}

.navbar-links li {
  margin-right: 40px;
}

.navbar-links a {
  color: rgba(17, 17, 17, 1); /* Jet */
  text-decoration: none;
  font-size: 17px;
}

.navbar-links a:hover {
  color: #F58A07; /* Tangerine */
  cursor: pointer;
}

.navbar-toggler {
  display: flex;
  cursor: pointer;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  margin-top: -10px;
  right: 15px;
  border: none;
  background: transparent;
}

.bar {
  height: 1px;
  width: 20px;
  background-color: rgba(17, 17, 17, 1); /* Jet */
  margin: 2px 0;
  border-radius: 2px;
}

/* New class for disabled links in the game page */
.disabled-links {
  pointer-events: none;
  opacity: 1; /* I link sono visibili ma non cliccabili */
}

.disabled-links a {
  opacity: 1; /* I link sono visibili ma non cliccabili */
}

@media (max-width: 768px) {
  .navbar-toggler {
    top: 60px;
    right: 0;
    background-color: #111111; /* Jet */
    flex-direction: column;
    align-items: center;
    width: 100%;
    padding: 20px;
  }

  .navbar-links li {
    margin: 0px 0;
   
  }

  .navbar-links a {
    font-size: 13px;
    margin-top: 3px;
     }

     .ship-to {
      font-size: 13px;
      margin-top: 3px;
     }

     .dropdown-content{
      font-size: 13px;
      margin-top: 3px;
     }

}
</style>