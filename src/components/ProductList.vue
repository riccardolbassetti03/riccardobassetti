<template>
  <div class="container py-4">
    <!-- Toggle Search Button -->
    <div class="text-end mb-3">
      <button 
        class="btn btn-outline-secondary rounded-pill shadow-sm px-4"
        @click="toggleSearch"
      >
        <i class="fas fa-search me-2"></i>
        {{ showSearch ? 'Close research' : 'Search product' }}
      </button>
    </div>

    <!-- Search Input -->
    <transition name="fade">
      <div 
        v-if="showSearch"
        class="row justify-content-center mb-4"
      >
        <div class="col-12 col-sm-10 col-md-8">
          <div class="position-relative">
            <input
              v-model="searchQuery"
              @input="performSearch"
              type="text"
              placeholder="Cerca tra i prodotti..."
              class="form-control bg-white border-0 shadow-sm ps-5 rounded-pill"
            />
            <i 
              class="fas fa-search position-absolute text-muted"
              style="left: 20px; top: 50%; transform: translateY(-50%);"
            ></i>
            <button 
              class="btn position-absolute"
              @click="clearSearch"
              style="right: 10px; top: 50%; transform: translateY(-50%);"
            >
              <i class="fas fa-times text-secondary"></i>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Search Results or Products -->
    <div v-if="loading" class="text-center py-5">
      Loading...
    </div>
    <div v-else class="row justify-content-center g-4">
      <div
        v-for="(product, index) in filteredProducts"
        :key="index"
        class="col-12 col-sm-10 col-md-6 col-lg-4 d-flex justify-content-center"
      >
        <router-link
          :to="`/product/${encodeURIComponent(product.name.toLowerCase().replace(/\s+/g, '-'))}/${product.id}`"
          class="product-card-link w-100"
        >
          <div class="product-card h-100 d-flex flex-column animate-fade-in">
            <img
              v-if="product.imageUrl"
              :src="product.imageUrl"
              alt="Product Image"
              class="product-image"
            />
            <div class="product-info">
              <h2 class="product-name">{{ product.name }}</h2>
              <p class="product-price">{{ product.price }}</p>
            </div>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db, storage } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { ref as storageRef, getDownloadURL } from 'firebase/storage';

export default {
  name: 'ProductList',
  data() {
    return {
      products: [],
      filteredProducts: [],
      loading: true,
      showSearch: false,
      searchQuery: ''
    };
  },
  watch: {
    '$route.query.search': {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.showSearch = true;
          this.searchQuery = newVal;
          this.performSearch();
        }
      }
    }
  },
  methods: {
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.searchQuery = '';
        this.filteredProducts = this.products;
      }
    },
    clearSearch() {
      this.searchQuery = '';
      this.filteredProducts = this.products;
    },
    performSearch() {
      if (!this.searchQuery.trim()) {
        this.filteredProducts = this.products;
        return;
      }
      const query = this.searchQuery.toLowerCase();
      this.filteredProducts = this.products.filter(product =>
        product.name.toLowerCase().includes(query)
      );
    }
  },
  async mounted() {
    try {
      const productCollection = collection(db, 'products');
      const productSnapshot = await getDocs(productCollection);

      const productPromises = productSnapshot.docs.map(async (doc) => {
        const product = doc.data();

        let imageUrl = '';
        if (product.mainImage) {
          try {
            imageUrl = await getDownloadURL(storageRef(storage, product.mainImage));
          } catch (err) {
            console.warn(`Immagine non trovata per ${product.name}`, err);
          }
        }

        return {
          id: doc.id,
          name: product.name,
          price: product.price,
          imageUrl,
          order: product.order ?? 0
        };
      });

      const productsWithImages = await Promise.all(productPromises);
      this.products = productsWithImages.sort((a, b) => a.order - b.order);
      this.filteredProducts = this.products;
    } catch (error) {
      console.error('Errore durante il recupero dei prodotti:', error);
    } finally {
      this.loading = false;
    }
  }
};
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

.product-card-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
}

.product-card {
  width: 100%;
  max-width: 600px;
  background: rgba(214, 238, 255, 0.5);
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
  transition: transform 0.3s ease;
}

.product-card:hover {
  cursor: pointer;
  transform: scale(1.03);
}

.product-image {
  height: 400px;
  width: 100%;
  object-fit: contain;
  flex-grow: 1;
}

.product-info {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  padding: 20px;
  background-color: #F8F5F0;
}

.product-name,
.product-price {
  font-size: 15px;
  color: #111111;
  font-weight: 800;
  flex: 1;
}

.product-name {
  text-align: left;
}

.product-price {
  text-align: right;
}

/* Search bar fade transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
