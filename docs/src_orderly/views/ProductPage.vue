<template>
  <div v-if="product" class="page-container text-white">
    <div class="mover-style">
      <div
        @click="goToPreviousProduct"
        :style="{ cursor: canGoBack ? 'pointer' : 'not-allowed', opacity: canGoBack ? 1 : 0.3 }"
      >
        BACK
      </div>
      <div>|</div>
      <div
        @click="goToNextProduct"
        :style="{ cursor: canGoNext ? 'pointer' : 'not-allowed', opacity: canGoNext ? 1 : 0.3 }"
      >
        NEXT
      </div>
    </div>

    <!-- MAIN CONTENT -->
    <div class="row gx-0 gx-md-5">
      <!-- Thumbnails: mobile -->
      <div class="d-flex d-md-none overflow-auto mb-3 px-3">
        <div
          v-for="(image, index) in product.imageGallery"
          :key="'mobile-thumb-' + index"
          class="thumb bg-secondary rounded me-2"
          :class="{ active: activeImage === image.url }"
          :style="{ backgroundImage: `url(${image.url})`, width: '60px', height: '60px', flex: '0 0 auto' }"
          @click="changeMainImage(image.url)"
        ></div>
      </div>

      <!-- Thumbnails: desktop -->
      <div class="col-md-2 d-none d-md-flex flex-md-column pe-md-1">
        <div
          v-for="(image, index) in product.imageGallery"
          :key="'desktop-thumb-' + index"
          class="thumb mb-3"
          :class="{ active: activeImage === image.url }"
          :style="{ backgroundImage: `url(${image.url})`, minHeight: '100px' }"
          @click="changeMainImage(image.url)"
        ></div>
      </div>

      <!-- MAIN IMAGE -->
      <div class="col-md-5 col-12 mb-4 ps-md-1">
        <div class="product-image-container" style="height: 70vh; min-height: 400px; max-height: 700px;">
          <div
            class="product-image w-100 h-100"
            :class="getImagePosition"
            :style="{ backgroundImage: `url(${activeImage})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }"
          ></div>
        </div>
      </div>

      <!-- PRODUCT DETAILS -->
      <div class="col-md-5 col-12 px-3 px-md-0 ps-md-5">
        <div class="item-name-controls text-uppercase mb-2">
          {{ product.name }}
        </div>
        <div class="item-price-controls">{{ product.price }}</div>
        <p class="product-description">
          {{ product.description }}
        </p>

        <!-- SIZE -->
        <div class="mb-4">
          <div class="size-buttons-container d-flex flex-wrap gap-2">
            <button
              v-for="size in product.sizes"
              :key="size"
              class="size-btn"
              :class="{ selected: selectedSize === size }"
              @click="selectedSize = size"
            >
              {{ size }}
            </button>
          </div>
        </div>

        <!-- BUTTONS -->
        <div v-if="product.price !== 'OUT SOON'" class="d-grid gap-2 mb-4">
          <button class="btn btn-buy" @click="handleBuyNow">Buy it Now</button>
          <button class="btn btn-cart" @click="handleAddToCart">Add to Cart</button>
        </div>

        <!-- ACCORDION -->
        <div class="accordion mt-4" id="productDetails">
          <div v-for="(section, i) in sections" :key="i">
            <div class="accordion-item">
              <h2 class="accordion-header">
                <button
                  class="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#collapse' + i"
                >
                  {{ section.title }}
                </button>
              </h2>
              <div :id="'collapse' + i" class="accordion-collapse collapse">
                <div class="accordion-body text-white" v-html="section.content"></div>
              </div>
            </div>
            <hr v-if="i < sections.length - 1" class="accordion-divider" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Loading -->
  <div v-else class="manage-prd-loading text-white text-center py-5">
    <span>Loading product details...</span>
  </div>

  <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
  <div id="cartToast" class="toast align-items-center text-bg-success border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        {{ toastMessage }}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>

<div class="position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
  <div id="buyNowToast" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
    <div class="d-flex">
      <div class="toast-body">
        THIS FUNCTION IS NOT WORKING YET
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  </div>
</div>
</template>

<script>
import { db, storage } from "@/firebase";
import { collection, query, orderBy, getDocs, doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { useCartStore } from "@/stores/cart"; // <--- IMPORTA STORE
import { Toast } from 'bootstrap';

export default {
  name: 'ProductPage',


  setup() {
    const cart = useCartStore(); // <--- INIZIALIZZA LO STORE
    return { cart };
  },

  data() {
    return {
      product: null,
      selectedSize: null,
      activeImage: '',
      productList: [],
      sections: [],
      toastMessage: '',
    };
  },

  computed: {
    canGoNext() {
      const index = this.productList.findIndex(p => p.id === this.product?.id);
      return index < this.productList.length - 1;
    },
    canGoBack() {
      const index = this.productList.findIndex(p => p.id === this.product?.id);
      return index > 0;
    },
    getImagePosition() {
      const image = this.product?.imageGallery?.find(img => img.url === this.activeImage);
      const position = image?.position || 'center';

      if (position === 'top') return 'image-top';
      if (position === 'cover') return 'image-cover';
      if (position === 'center') return 'image-center';
      if (position === 'bottom') return 'image-bottom';
      return '';
    }
  },
  watch: {
  '$route.params.id': {
    immediate: true,
    handler: async function (newId) {
      if (!newId) return;

      // Se productList è vuoto, caricalo
      if (this.productList.length === 0) {
        const q = query(collection(db, 'products'), orderBy('order'));
        const querySnapshot = await getDocs(q);
        const products = [];
        querySnapshot.forEach(doc => {
          products.push({ id: doc.id, ...doc.data() });
        });
        this.productList = products;
      }

      const currentProduct = this.productList.find(p => p.id === newId);
      if (!currentProduct) {
        console.error('Product not Found with ID:', newId);
        return;
      }

      await this.loadProductDetails(currentProduct);
    }
  }
},


  methods: {
    async loadProductDetails(product) {
      const docRef = doc(db, 'products', product.id);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        console.error('Product not Found', product.id);
        return;
      }

      const data = docSnap.data();

      let mainImageUrl = 'default-image-url';
      if (data.mainImage) {
        try {
          mainImageUrl = await getDownloadURL(storageRef(storage, data.mainImage));
        } catch (err) {
          console.error('Error While Trying to load main image', err);
        }
      }

      let imageGallery = [];
      if (data.imageGallery && data.imageGallery.length > 0) {
        try {
          imageGallery = await Promise.all(
            data.imageGallery.map(async (imgObj) => {
              const imgUrl = await getDownloadURL(storageRef(storage, imgObj.path)).catch(() => 'default-image-url');
              return { url: imgUrl, position: imgObj.position };
            })
          );
        } catch (err) {
          console.error('Error While Trying to load images', err);
        }
      }

      this.product = {
        ...data,
        id: product.id,
        mainImageUrl,
        imageGallery
      };

      this.activeImage = mainImageUrl || imageGallery[0]?.url || 'default-image-url';
      this.selectedSize = data.sizes && data.sizes.length > 0 ? data.sizes[0] : null;

      this.sections = [
        {
          title: 'SHIPPING',
          content: `
            <div style="line-height: 1.0; font-size: 15px; color: #111111">
              SHIPPING IN 2/3 BUSINESS DAYS ONCE UPON RECIVING YOUR ORDER<br><br>
              WE ARE CURRENTLY ABLE TO SHIP TO: ITALY, UK, USA, GERMANY, FRANCE<br><br>
              ITALY: DELIVERY IN 2/3 BUSINESS DAY WITH POSTE ITALIANE, GLS, OR DHL<br><br>
              REST OF THE COUNTRIES: DELIVERY IN 5/7 BUSINESS DAY WITH DHL OR FEDEX<br><br>
              YOU SHOULD REALLY CHECK OUR <a href="#" style="text-decoration: underline; color: rgb(90, 50, 30);">RETURN GUIDELINES</a>
            </div>`
        },
        {
          title: 'ABOUT THE PRODUCT',
          content: `<div style="font-size: 15px; color: #111111;"> <ul style="padding-left: 1.5rem;">` +
                  (data.about || '')
                    .split('\n')
                    .map(line => `<li>${line.trim()}</li>`)
                    .join('') +
                  `</ul>
                   </div>`
                   
        }

      ];
    },

    changeMainImage(newImage) {
      this.activeImage = newImage;
    },
    
    handleBuyNow() {
  const toastEl = document.getElementById('buyNowToast');
  const toast = new Toast(toastEl);
  toast.show();
},

    handleAddToCart() {
      if (!this.product) {
        alert('Il prodotto non è ancora stato caricato.');
        return;
      }

      const product = {
        id: this.product.id,
        name: this.product.name,
        size: this.selectedSize,
        price: this.product.price,
        image: this.activeImage,
      };

      this.cart.addToCart(product);

      this.toastMessage = `Added "${this.product.name}" to cart`;
  const toastEl = document.getElementById('cartToast');
  const toast = new Toast(toastEl);
  toast.show();

    },

    goToNextProduct() {
      const currentIndex = this.productList.findIndex(p => p.id === this.product.id);
      if (currentIndex >= 0 && currentIndex < this.productList.length - 1) {
        const nextProduct = this.productList[currentIndex + 1];
       const name = encodeURIComponent(nextProduct.name.toLowerCase().replace(/\s+/g, '-'));
this.$router.push(`/product/${name}/${nextProduct.id}`);
      }
    },

    goToPreviousProduct() {
      const currentIndex = this.productList.findIndex(p => p.id === this.product.id);
      if (currentIndex > 0) {
        const prevProduct = this.productList[currentIndex - 1];
        const name = encodeURIComponent(prevProduct.name.toLowerCase().replace(/\s+/g, '-'));
        this.$router.push(`/product/${name}/${prevProduct.id}`);
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 0 15px;
  max-width: 1400px;
  margin: 0 auto;
  
  gap: 50rem;
  position: relative;
  top: 100px;
}

.manage-prd-loading {
  color: #111111;
  text-align: center;

}

/* Thumbnails */
.thumb {
  height: 120px;
  width:100px;
  background-size: cover;
  background-position: center;
  border-radius: 4px;
  cursor: pointer;
  background-color: rgba(214, 238, 255, 0.6);
  transition: all 0.2s ease;
  margin-bottom: 1rem; /* Aumentato spazio tra le thumbnails */
}
.mover-style {
  display: flex;
  color: #111111;
  justify-content: center;
  gap: 30px;
  margin-bottom: 2rem;
}


.thumb.active {
  outline: 2px solid #B8DFFC;
  background-color: #B8DFFC;
  transform: scale(1.05);
}

.thumb:hover {
  transform: scale(1.05);
}

/* Product Image */
.product-image-container {
  background-color: rgba(214, 238, 255, 0.6);
}

.product-image {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover; /* oppure 'contain' se preferisci non tagliare l'immagine */
  width: 100%;
  height: 100%;
}
.image-top {
  background-position: top;
}

.image-bottom {
  background-position: bottom;
}

.image-center {
  background-position: center;
}

.image-cover {
  background-size: cover;
}

/* Product Details */
.item-name-controls {
  font-size: 2rem;
  font-weight: bold;
  color: #111111;

}
.item-price-controls {
  font-size: 1.5rem;
  color: #FF6A00;

}

@media (max-width: 768px) {
  .item-name-controls {
    font-size: 1.2rem;
  }
  .product-details-container {
    padding-left: 3rem; /* Aumentato spazio tra immagine e testo */
  }
}

.product-description {
  font-size: 0.9rem;
  color: #111111;
  margin-bottom: 1rem;
  margin-top: 1rem;
}

/* Size Buttons */
.size-buttons-container {
  margin-top: 1rem;
}

.size-btn {
  border: 1px solid rgba(17, 17, 17, 1);
  color: rgba(17, 17, 17, 1);
  background: transparent;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.size-btn.selected {
  border-color: #FF6A00;
  color: #FF6A00;
}

.size-btn:hover {
  transform: scale(1.05);
}

/* Action Buttons */
.btn-buy, .btn-cart {
  font-size: 1rem;
  width: 100%;
  height: 50px;
  padding: 0.75rem;
  margin-bottom: 5px;
  transition: all 0.2s ease;
}

@media (min-width: 768px) {
  .btn-buy, .btn-cart {
    height: 60px;
    font-size: 1.1rem;
  }
}

.btn-buy {
  background-color: #e89c4a;
  color: black;
  font-weight: bold;
}

.btn-buy:hover {
  background-color: #E65C00;
}

.btn-cart {
  background-color: #003A9A;
  color: rgba(255, 255, 255, 0.9);
  font-weight: bold;
}

.btn-cart:hover {
  background-color: #002D7A;
}

.buy-now-message {
  color: black;
  font-size: 14px;
}

/* Accordion */
.accordion-button,
.accordion-item,
.accordion-body,
.accordion-header {
  background-color: #F8F5F0;
  font-size: 15px;
  color: #111111 !important;
  border: none !important;
}

@media (max-width: 768px) {
  .accordion-button,
  .accordion-item,
  .accordion-body,
  .accordion-header {
    width: 100%;
  }
}

.accordion-divider {
  border: none;
  border-top: 3px solid #111111;
  margin: 0.5rem 0;
  width: 100%;
}

.accordion-button:not(.collapsed) {
  box-shadow: none;
  color: #111111 !important;
  background-color: transparent;
}

.accordion-button:focus {
  box-shadow: none;
  color: #111111 !important;
  background-color: transparent;
}

.accordion-button::after {
  color: #111111 !important;
}
</style>