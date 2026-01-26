<template>
  <div class="container py-4 py-md-5">

    <!-- Empty Cart Message -->
    <div v-if="cart.items.length === 0" class="d-flex flex-column align-items-center justify-content-center py-5">
      <img src="@/assets/icons/empty-cart.png" alt="Empty Cart" class="mb-4" style="width: 80px; height: auto;">
      <p class="fs-4 mb-4 text-brown">Your Cart is Empty</p>
      <router-link to="/home" class="w-100 text-center">
        <button class="btn btn-primary btn-browse">Browse Our Products</button>
      </router-link>
    </div>

    <!-- Cart with Items -->
    <div v-else class="cart-items-wrapper">
      <!-- Table Header - Desktop -->
      <h2 v-if="cart.items.length > 0" class="text-center mb-4 mb-md-5 fw-bold text-brown">CART</h2>
      <div class="row d-none d-md-flex py-3 border-bottom border-brown">
        <div class="col-md-6 text-brown fw-bold">PRODUCT</div>
        <div class="col-md-3 text-center text-brown fw-bold">QUANTITY</div>
        <div class="col-md-3 text-end text-brown fw-bold">PRICE</div>
      </div>

      <!-- Cart Items -->
      <div v-for="item in cart.items" :key="`${item.id}-${item.size}`">
        <!-- MOBILE SEPARATOR ROW -->
        <div class="row d-block d-md-none mb-3">
          <div class="col-12 border-top border-brown"></div>
        </div>

        <!-- ITEM ROW -->
        <div class="row py-3 py-md-4 border-bottom border-brown align-items-center">
          <!-- Product Info -->
          <div class="col-12 col-md-6 mb-3 mb-md-0">
            <div class="d-flex align-items-center">
              <img :src="item.image" alt="Product" class="me-3 image-background" style="width: 100px; height: 100px; object-fit: cover;">
              <div>
                <div class="fw-bold text-brown">{{ item.name }}</div>
                <div class="text-brown">Size {{ item.size }}</div>
              </div>
            </div>
          </div>

          <!-- Quantity Controls -->
          <div class="col-6 col-md-3 pt-3">
            <div class="d-flex flex-column align-items-center">
              <div class="d-flex align-items-center mb-2">
                <button class="btn btn-outline-brown px-3" @click="cart.decreaseQuantity(item.id, item.size)">-</button>
                <span class="mx-3 text-brown">{{ item.quantity }}</span>
                <button class="btn btn-outline-brown px-3" @click="cart.increaseQuantity(item.id, item.size)">+</button>
              </div>
              <button class="btn btn-link text-red text-decoration-underline" @click="cart.removeFromCart(item.id, item.size)">Remove</button>
            </div>
          </div>

          <!-- Price -->
          <div class="col-6 col-md-3 text-end text-brown fw-bold pt-3 text-md-end text-center">
            {{ formatPrice(cart.convertPrice(item.price) * item.quantity) }}
          </div>
        </div>
      </div>

      <!-- Total and Checkout -->
      <div class="row mt-4 justify-content-end">
        <div class="col-12 col-md-4">
          <div class="d-flex flex-column align-items-end">
            <div class="fw-bold fs-5 text-brown mb-3">Total: {{ formatPrice(cart.totalPrice) }}</div>
            <button class="btn btn-checkout w-100 mb-2" @click="handleCheckout">Checkout</button>
            <div v-if="checkoutMessageVisible" class="text-brown">
              We are still working on this!
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useCartStore } from "@/stores/cart";

export default {
  name: "CartPage",
  data() {
    return {
      cart: useCartStore(),
      checkoutMessageVisible: false,
    };
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString("it-IT", {
        style: "currency",
        currency: "EUR",
      });
    },
    handleCheckout() {
      this.checkoutMessageVisible = true;
      setTimeout(() => {
        this.checkoutMessageVisible = false;
      }, 3000);
    },
  },
};
</script>

<style scoped>

.cart-items-wrapper {
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 100px;
}

.image-background{
  background-color: #D6EEFF;
  border-radius: 20px;
}

/* Custom Colors */
.text-brown {
  color: #111111;
}

.text-red{
  color: #B02E0C;
}

.text-red:hover{
  color: #B02E0C;
}

.border-brown {
  border-color: #111111 !important;
}

.btn-outline-brown {
  color: #111111;
  border-color: #111111;
  border-radius: 10px;
}

.btn-outline-brown:hover {
  color: #FF6A00;
  border-color: #FF6A00;
}

/* Empty Cart */
.empty-cart-message {
  min-height: 60vh;
}

/* Buttons */
.btn-browse {
  background-color: #e89c4a;
  border: 2px solid #e89c4a;
  color: black;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.75rem;
  max-width: 400px;
  width: 100%;
}

.btn-browse:hover {
  background-color: #E65C00;
  border-color: #E65C00;
}

.btn-checkout {
  background-color: #e89c4a;
  border: 2px solid #e89c4a;
  color: black;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.75rem;
}

.btn-checkout:hover {
  background-color: #E65C00;
  border-color: #E65C00;
  color: white;
}

/* Responsive Adjustments */
@media (max-width: 767.98px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .btn-browse,
  .btn-checkout {
    font-size: 1rem;
    padding: 0.6rem;
  }

  .row {
    margin-bottom: 1rem;
  }

  /* Stack quantity controls vertically on mobile */
  .col-6.col-md-3 {
    text-align: center;
  }

  .col-6.col-md-3 .d-flex.flex-column.flex-md-row {
    flex-direction: column !important;
    align-items: center;
  }

  .col-6.col-md-3 .btn-link {
    padding-left: 0 !important;
    margin-top: 0.5rem;
  }

  .col-6.col-md-3 span {
    margin: 0 1rem;
  }

  .col-6.col-md-3 .btn-outline-brown {
    padding: 0.4rem 0.8rem;
  }

  .col-12.col-md-6 {
    text-align: center;
  }

  .col-12.col-md-6 img {
    width: 80px !important;
    height: 80px !important;
  }

  .text-end {
    text-align: center !important;
  }
}

@media (min-width: 768px) and (max-width: 991.98px) {
  img {
    width: 120px !important;
    height: 120px !important;
  }
}
</style>
