<template>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <div>
    <!-- Overlay -->
    <div v-if="isOpen" class="overlay" @click="closeSidebar"></div>

    <!-- Sidebar -->
    <div class="sidebar" :class="{ open: isOpen }">
      <button class="close-btn" @click="closeSidebar">✕</button>
      <nav class="sidebar-content">
        <!-- Main Navigation Links -->
        <router-link to="/" @click="closeSidebar">ACCESS</router-link>
        <router-link to="/home" @click="closeSidebar">HOME</router-link>
        <router-link to="/cart" @click="closeSidebar">CART</router-link>
        <router-link to="/about" @click="closeSidebar">ABOUT</router-link>
       <router-link 
  to="/SecretPage" 
  @click="closeSidebar" 
  class="disabled-mobile"
>
  ????? 
</router-link>


        <!-- Social Dropdown -->
        <div @click="toggleSocialDropdown" class="dropdown-header">
          <span>SOCIAL</span>
          <span class="arrow">{{ isSocialOpen ? '▲' : '▼' }}</span>
        </div>
        <div v-if="isSocialOpen" class="dropdown-content">
          <a href="https://www.instagram.com/ephemeral.cmyk" target="_blank" class="no-border">INSTAGRAM</a>
          <a href="https://it.pinterest.com/ephemeralcmyk/" target="_blank" class="no-border">PINTEREST</a>
        </div>
      </nav>

      <!-- Footer fixed to bottom -->
      <div class="sidebar-footer">
        <!-- Newsletter -->
        <div class="newsletter" v-if="!subscribed">
          <form @submit.prevent="subscribe">
            <div class="mb-3">
              <label for="newsletterEmail" class="form-label label-newsletter-color">Newsletter</label>
              <input type="email" v-model="email" class="form-control form-newsletter-color" id="newsletterEmail" required>
            </div>
            <button type="submit" class="btn btn-primary btn-newsletter-color">Subscribe</button>
          </form>
        </div>

        <!-- Horizontal separator -->
        <div class="confirmation-line"></div>

        <!-- Login -->
        <!-- Login -->
<router-link
  v-if="!currentUser"
  to="/login"
  @click="closeSidebar"
  class="login-link"
>
  <i class="fas fa-user-circle"></i> LOGIN
</router-link>

<div v-else class="login-link" style="justify-content: space-between;">
  <router-link
    to="/login"
    @click="closeSidebar"
    style="text-transform: uppercase; color: inherit; text-decoration: none; flex-grow: 1;"
  >
    <i class="fas fa-user-circle"></i> LOGGED IN AS {{ currentUserName.toUpperCase() }}
  </router-link>

  <button
    @click="handleLogout"
    style="background: transparent; border: none; color: #001F5C; cursor: pointer; font-weight: bold; font-size: 14px; margin-left: 10px;"
    title="Logout"
  >
    LOGOUT
  </button>
</div>

<!-- Line under login -->
<div class="confirmation-line"></div>

<!-- Copyright -->
<div class="copyright">
  © 2025 - Orderly P.I. 23729810
</div>
      </div>
    </div>
  </div>
</template>

<script>

import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase"; // Assicurati che il path sia corretto

export default {
  name: 'AppSideBar',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close'],
  data() {
    return {
      isSocialOpen: false,
      email: '',
      subscribed: false,
      currentUser: null,
    currentUserName: '',
    };
  },
  created() {
    const isSubscribed = localStorage.getItem('isSubscribed');
    if (isSubscribed) {
      this.subscribed = true;
    }
  },
  mounted() {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      this.currentUser = user;
      const userDoc = doc(db, "users", user.uid);
      const userSnap = await getDoc(userDoc);
      if (userSnap.exists()) {
        this.currentUserName = userSnap.data().name || "Utente";
      }
    } else {
      this.currentUser = null;
      this.currentUserName = '';
    }
  });
},

  watch: {
    isOpen(newVal) {
      document.body.style.overflow = newVal ? 'hidden' : '';
    }
  },
  methods: {
    closeSidebar() {
      this.$emit('close');
      this.isSocialOpen = false;
    },
     handleCapventureClick(event) {
    if (window.innerWidth <= 768) {
      event.preventDefault();  // Blocca il click su mobile
    } else {
      this.closeSidebar();
    }
  },
    toggleSocialDropdown() {
      this.isSocialOpen = !this.isSocialOpen;
    },
    subscribe() {
      this.subscribed = true;
      this.email = '';
      localStorage.setItem('isSubscribed', 'true');
    },

    async handleLogout() {
    try {
      await signOut(auth);
      this.currentUser = null;
      this.currentUserName = '';
      this.closeSidebar();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
  }
};
</script>

<style scoped>
/* Sidebar base */
.overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  background: rgba(28, 27, 29, 0.6);
  z-index: 998;
}
.sidebar {
  position: fixed;
  top: 0;
  right: -350px;
  width: 350px;
  height: 100%;
  background-color: #F8F5F0; /*rgb(255, 235, 200)*/
  z-index: 999;
  transition: right 0.3s ease-in-out;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}
.sidebar.open {
  right: 0;
}
.close-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  background: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
  color: #111111; /* rgb(90, 50, 30)*/
}

/* Navigation */
.sidebar-content {
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  margin-top: 80px;
}


.sidebar-content a,
.dropdown-header {
  color: #111111;/* rgb(90, 50, 30)*/
  font-size: 15px;
  text-decoration: none;
  padding: 12px 0;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.sidebar-content a:not(.no-border),
.dropdown-header {
  border-bottom: 2px solid #111111;
}

.sidebar-content a:hover,
.dropdown-header:hover {
  color: #001F5C;
}

/* Dropdown */
.arrow {
  font-size: 12px;

  margin-left: 10px;
}
.dropdown-content {
  display: flex;
  flex-direction: column;
  background-color: #F8F5F0;
  margin-bottom: 15px;
}
.dropdown-content a {
  padding: 12px 0;
  color: #111111;/* rgb(90, 50, 30)*/
  text-align: center;
  font-size: 15px;
  padding-left: 30px;
  padding-right: 30px;
  position: relative;
  text-decoration: none;
}
.dropdown-content a::after {
  content: "";
  position: absolute;

  bottom: 0;
  left: 30px;
  width: calc(100% - 30px);
  border-bottom: 2px solid #111111;/* rgb(90, 50, 30)*/
}


/* Footer styles */
.sidebar-footer {
  margin-top: auto;
  padding-top: 20px;
  padding-bottom: 30px;
}
.newsletter {
  margin-bottom: 2px;
}
.label-newsletter-color {
  color: #111111;/* rgb(90, 50, 30)*/
  font-size: 15px;
  margin-bottom: 5px;
}
.form-newsletter-color {
  background-color: #FFF3E4; /*color*/
  border: 1px solid #001F5C;
  color: white;
  font-size: 12px;
  width: 100%;
}
.btn-newsletter-color {
  background-color: #001F5C; /*#F9AB55*/
  font-weight: bold;
  color: white;
  font-size: 15px;
  width: 100%;
  border: none;
  margin-top: 2px;
}

.btn-newsletter-color:hover {
  background-color: #002D7A; /*#F9AB55*/
  color: white;
  font-size: 15px;
  width: 100%;
  border: none;
  margin-top: 2px;
}

input[type="email"]:focus {
  border-color: #001F5C; /*#F9AB55*/
  box-shadow: 0 0 0 0.2rem #001F5C;
}

/* Separator line */
.confirmation-line {
  width: 100%;
  max-width: 350px;
  border-bottom: 2px solid #111111;
  margin: 20px 0;
}

/* Login link */
.login-link {
  color: #111111; /* rgb(90, 50, 30)*/
  font-size: 14px;
  text-decoration: none;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.login-link i {
  margin-right: 8px;
  font-size: 20px;
}
.login-link:hover {
  color: #001F5C; 
  cursor: pointer;
}

/* Copyright */
.copyright {
  color: #111111; 
  font-size: 17px;
  text-align: right;
}

@media (max-width: 768px) {
  .disabled-mobile {
    pointer-events: none;  /* Non cliccabile */
    opacity: 0.5;          /* Visivamente disabilitato */
    cursor: default;
  }
}
</style>
