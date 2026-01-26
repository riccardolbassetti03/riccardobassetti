<template>
  <link
    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
    rel="stylesheet"
  />
  <div class="container-fluid min-vh-100 d-flex align-items-center justify-content-center">
    <div class="card p-4 login-card shadow-lg">
      <div class="text-start">
        <h2 class="login-title">Welcome to Ephemeral</h2>
        <h6 class="login-motto">Fashion made Easier</h6>
      </div>

      <div class="text-end">
        <button type="button" class="btn-close" @click="closebutton"></button>
      </div>

      <hr class="my-3 login-divider" />

      <form @submit.prevent="register">
        <div class="row mb-3">
          <div class="col">
            <label for="register-name" class="form-label">Name</label>
            <input
              type="text"
              class="form-control login-form"
              id="register-name"
              v-model="name"
              required
            />
          </div>
          <div class="col">
            <label for="register-surname" class="form-label">Surname</label>
            <input
              type="text"
              class="form-control login-form"
              id="register-surname"
              v-model="surname"
              required
            />
          </div>
        </div>

        <div class="mb-3">
          <label for="register-email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control login-form"
            id="register-email"
            v-model="email"
            required
          />
        </div>

        <div class="mb-3 position-relative">
          <label for="register-password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control login-form"
            id="register-password"
            v-model="password"
            required
          />
          <button
            class="btn btn-sm eye-toggle-btn"
            type="button"
            @click="togglePassword"
          >
            <i id="registerEyeIcon" class="bi bi-eye"></i>
          </button>
        </div>

        <button type="submit" class="btn btn-warning w-100 login-btn">Register</button>

        <div class="text-center mt-3">
          <router-link to="/login" class="text-decoration-underline login-link">or Login</router-link>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-4 text-muted small">
          <router-link :to="{ path: '/about', query: { section: 'about-us' } }" class="login-link">About</router-link>
          <router-link :to="{ path: '/about', query: { section: 'privacy-policy' } }" class="login-link">Privacy</router-link>
          <router-link :to="{ path: '/about', query: { section: 'terms-of-use' } }" class="login-link">Terms</router-link>
        </div>
      </form>
    </div>

    <!-- TOAST -->
    <div class="position-fixed bottom-0 start-50 translate-middle-x p-3" style="z-index: 1100">
      <div
        :class="['toast align-items-center border-0', toastClass]"
        role="alert"
        ref="toastElement"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body" ref="toastBody"></div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            data-bs-dismiss="toast"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { Toast } from "bootstrap";

export default {
  name: 'RegisterPage',
  data() {
    return {
      name: '',
      surname: '',
      email: '',
      password: '',
      toastInstance: null,
      toastClass: 'text-bg-primary'
    };
  },
  mounted() {
    this.toastInstance = new Toast(this.$refs.toastElement, { delay: 4000 });
  },
  methods: {
    showToast(message, type = 'primary') {
      const classMap = {
        success: 'text-bg-success',
        danger: 'text-bg-danger',
        primary: 'text-bg-primary',
      };
      this.toastClass = classMap[type] || classMap.primary;
      this.$refs.toastBody.textContent = message;

      const toast = new Toast(this.$refs.toastElement, { delay: 4000 });
  toast.show();
    },
    togglePassword() {
      const passField = document.getElementById("register-password");
      passField.type = passField.type === "password" ? "text" : "password";
    },
    async register() {
      if (!this.name || !this.surname || !this.email || !this.password) {
        this.showToast("Please, input all data", "danger");
        return;
      }

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, this.email, this.password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          name: this.name,
          surname: this.surname,
          email: this.email,
          createdAt: new Date()
        });

        this.showToast("You've been registered correctly", "success");
        setTimeout(() => {
         window.location.href = "/#/home";
        }, 5000);

      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          this.showToast("You are already registered", "danger");
        } else {
          this.showToast("Error: " + error.message, "danger");
        }
      }
    },
    closebutton() {
      window.location.href = "/#/home";
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.eye-toggle-btn {
  position: absolute;
  right: 10px;
  transform: translateY(-114%);
  background: transparent;
  border: none;
  color: #111111;
}

.toast {
  min-width: 250px;
  max-width: 90vw;
  text-align: center;
}

.login-card {
  max-width: 600px;
  width: 100%;
  background-color: rgba(184, 223, 252, 0.3);
}

.login-motto {
  color: #111111;
  font-style: italic;
  font-size: 18px;
}

.login-title {
  color: #111111;
  font-style: italic;
  font-weight: bold;
  font-size: 32px;
}

.login-form {
  background-color: rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(1, 1, 1, 0.4);
  color: black !important;
}

.login-form:focus {
  border-color: rgba(184, 223, 252, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(184, 223, 252, 0.5);
}

.login-btn {
  font-size: 23px;
  border: none;
  font-weight: bold;
  color: white;
  background-color: #003A9A;
}

.login-btn:hover {
  background-color: #002D7A;
  color: white;
}

.login-link {
  color: #111111;
  font-size: 16px;
  cursor: pointer;
}

.login-divider {
  background-color: #111111;
  height: 3px;
  opacity: 1;
}

@media (max-width: 767px) {
  .login-title {
    white-space: nowrap;
    font-size: 28px;
  }
}
</style>
