// percorso: src/stores/cart.js
import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
  }),
  getters: {
    itemCount: (state) => state.items.reduce((total, item) => total + item.quantity, 0),
    totalPrice: (state) => {
      console.log("Items in cart:", state.items); // Debugging
      return state.items.reduce((total, item) => {
        const price = state.convertPrice(item.price);  // Usa il metodo come funzione
        if (price !== undefined) {
          console.log(`Price for ${item.name}: ${price}`); // Debugging
          return total + price * item.quantity;
        } else {
          console.log(`Price for ${item.name} is undefined`);
          return total;  // Se il prezzo non è valido, non aggiungere nulla
        }
      }, 0);
    },
  },
  actions: {
    // Funzione di conversione del prezzo da stringa a numero
    convertPrice(priceString) {
      console.log(`Converting price: ${priceString}`); // Debugging
      if (typeof priceString === 'string' && priceString) {
        // Se priceString è una stringa, procedi con la conversione
        const cleanPrice = priceString.replace('€', '').replace(',', '.');
        const price = parseFloat(cleanPrice);
        if (!isNaN(price)) {
          return price;
        } else {
          console.log("Price conversion failed: invalid format");
        }
      } else {
        console.log("Price is not a string:", priceString); // Debugging
      }
      return undefined;  // Se priceString non è valido, ritorna undefined
    },
    addToCart(product) {
      const existingItem = this.items.find(
        (item) => item.id === product.id && item.size === product.size
      );

      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.items.push({ ...product, quantity: 1 });
      }
    },
    removeFromCart(productId, size) {
      this.items = this.items.filter(
        (item) => !(item.id === productId && item.size === size)
      );
    },
    increaseQuantity(productId, size) {
      const item = this.items.find(
        (item) => item.id === productId && item.size === size
      );
      if (item) item.quantity++;
    },
    decreaseQuantity(productId, size) {
      const item = this.items.find(
        (item) => item.id === productId && item.size === size
      );
      if (item && item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(productId, size);
      }
    },
  },
});
