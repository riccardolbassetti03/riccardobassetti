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

      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="login-email" class="form-label">Email address</label>
          <input
            type="email"
            class="form-control login-form"
            id="login-email"
            v-model="email"
            required
          />
        </div>

        <div class="mb-3 position-relative">
          <label for="login-password" class="form-label">Password</label>
          <input
            type="password"
            class="form-control login-form"
            id="login-password"
            v-model="password"
            required
          />
          <button
            class="btn btn-sm eye-toggle-btn"
            type="button"
            @click="togglePassword"
          >
            <i id="loginEyeIcon" class="bi bi-eye"></i>
          </button>
        </div>

        <div class="text-end mb-3">
          <small @click="forgotPassword" class="text-decoration-underline login-link">Forgot Password?</small>
        </div>

        <button type="submit" class="btn btn-warning w-100 login-btn">Login</button>
        <div class="text-center mt-3">
          <router-link to="/register" class="text-decoration-underline login-link">or Register</router-link>
        </div>

        <div class="d-flex justify-content-center gap-3 mt-4 text-muted small">
          <router-link :to="{ path: '/about', query: { section: 'about-us' } }" class="login-link">About</router-link>
          <router-link :to="{ path: '/about', query: { section: 'privacy-policy' } }" class="login-link">Privacy</router-link>
          <router-link :to="{ path: '/about', query: { section: 'terms-of-use' } }" class="login-link">Terms</router-link>
        </div>
      </form>
    </div>

    <!-- TOAST -->
    <div
  class="position-fixed bottom-0 start-50 translate-middle-x p-3"
  style="z-index: 1100;"
>
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
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";
import { Toast } from "bootstrap";

export default {
  name: "LoginPage",
  data() {
    return {
      email: "",
      password: "",
      toastInstance: null,
      toastClass: "text-bg-primary" // valore iniziale
    };
  },
  mounted() {
    this.toastInstance = new Toast(this.$refs.toastElement, { delay: 4000 });
  },
  methods: {
    showToast(message, type = "primary") {
      const toastClassMap = {
        success: "text-bg-success",
        danger: "text-bg-danger",
        primary: "text-bg-primary",
      };
      this.toastClass = toastClassMap[type] || toastClassMap.primary;
      this.$refs.toastBody.textContent = message;
      this.toastInstance.show();
    },
    togglePassword() {
      const passField = document.getElementById("login-password");
      passField.type = passField.type === "password" ? "text" : "password";
    },
    async login() {
      if (!this.email || !this.password) {
        this.showToast("Input Email or Password", "danger");
        return;
      }
      try {
        await signInWithEmailAndPassword(auth, this.email, this.password);
        window.location.href = "/#/home";
      } catch (error) {
        if (
          error.code === "auth/user-not-found" ||
          error.code === "auth/wrong-password"
        ) {
          this.showToast("Email or Password are not correct", "danger");
        } else {
          this.showToast("Error while trying to Log you in", "danger");
        }
      }
    },
    closebutton() {
      window.location.href = "/#/home";
    },
    async forgotPassword() {
      if (!this.email) {
        this.showToast("Input your Email for password recovery", "danger");
        return;
      }
      try {
        await sendPasswordResetEmail(auth, this.email);
        this.showToast(`We have sent an email to: ${this.email}`, "success");
      } catch (error) {
        this.showToast("Error while sending you an Email, try again later", "danger");
      }
    },
  },
};
</script>


<style scoped>
.eye-toggle-btn {
  position: absolute;
  right: 10px;
  transform: translateY(-114%);
  background: transparent;
  border: none;
  color: #111111;
}

.form-label{
  font-size: 17px;
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
  border: 1px solid rgba(1,1,1, 0.4);
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
  background-color:  #003A9A;
}

.login-btn:hover {
  color: white;
  background-color:  #002D7A;
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
 .login-title{
  white-space: nowrap;
  font-size: 28px;
  }}
</style>
