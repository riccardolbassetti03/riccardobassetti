<template>
    <div class="gallery-container">
      <transition-group name="fade" tag="div">
        <img
          v-for="(image, index) in images"
          :key="index"
          v-show="currentIndex === index"
          :src="require(`@/assets/galleryImgs/${image}`)"
          alt="gallery"
          class="gallery-image"
        />
      </transition-group>
     <!-- ENTER Centered -->
      <div class="welcome-text-container">

      <div class="logo-gif-container">
  <img src="@/assets/spinningLogo.gif" alt="Spinning Logo" class="logo-gif" />
</div>

      <p class="welcome-text">WELCOME TO EPHEMERAL</p>
    </div>

      <div class="enter-button-container">
      <button class="enter-button" @click="enterGallery">ENTER</button>
    </div>
  
      <!-- Instagram icon -->
      <div class="instagram-icon">
        <a href="https://www.instagram.com/ephemeral.cmyk" target="_blank">
          <img src="@/assets/icons/instagram-white-icon.png" alt="Instagram" />
        </a>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'GalleryPage',
    data() {
      return {
        images: [
          'carouselOne.png',
          'carouselTwo.png',
          'carouselThree.png',
          'carouselFour.png'
        ],
        currentIndex: 0,
        intervalId: null
      }
    },
    mounted() {
      this.startCarousel();
    },
    beforeUnmount() {
      clearInterval(this.intervalId);
    },
    methods: {
      startCarousel() {
        this.intervalId = setInterval(() => {
          this.currentIndex = (this.currentIndex + 1) % this.images.length;
        }, 5000); 
      },
      enterGallery() {
      this.$router.push('/home');
      }
    }
  }
  </script>
  
  <style scoped>

  .welcome-text-container {
  position: absolute;
  top: 45%; 
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.logo-gif-container {
  position: absolute;
  top: -80px;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.logo-gif {
  width: 400px;
  height: 400px;
  object-fit: contain;
}

.welcome-text {
  color: white;
  font-size: 40px;
  font-weight: bold;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  margin: 0;
}

  .enter-button-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.enter-button {
  background-color: transparent;
  color: white;
  padding: 15px 30px;
  margin-top: 80px;
  font-size: 30px;
  font-weight: bold;
  border: none;
  text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.8);
  cursor: pointer;
  outline: none;
}

.enter-button:hover {
  background-color: none;
  color: #D6EEFF;
  transition: background-color 0.3s, color 0.3s;
}

  .gallery-container {
    position: relative;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: 0; 
  }
  

  .gallery-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: 0;
    transition: opacity 1s ease-in-out;
  }
  

  .instagram-icon {
    position: absolute;
    bottom: 20px;
    right: 20px;
    z-index: 10;
  }

  .instagram-icon:hover{
   box-shadow: 1px, 1px, 4px #D6EEFF;
  }
  
  .instagram-icon img {
    width: 50px;
    height: 50px;
    filter: brightness(0) invert(1); 
    cursor: pointer;
  }
  
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s ease;
  }
  
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }


  @media (min-width: 768px) and (max-width: 1024px) {
  .welcome-text {
    font-size: 3.5vw;
    white-space: nowrap;
    text-align: center;
    padding: 0 10px;
  }

  .enter-button {
    font-size: 3vw;
    padding: 12px 25px;
    margin-top: 60px;
  }

  .instagram-icon img {
    width: 40px;
    height: 40px;
  }

  .welcome-text-container {
    top: 43%;
  }

  .enter-button-container {
    top: 51%;
  }
}

@media (max-width: 767px) {
  .welcome-text {
    font-size: 6vw;
    text-align: center;
    padding: 0 5px;
    white-space: nowrap;
  }

  .logo-gif {
    width: 400px;
    height: 400px;
  }

  .enter-button {
    font-size: 10vw;
    padding: 10px 20px;
    margin-top: 30px;
  }

  .instagram-icon img {
    width: 35px;
    height: 35px;
  }

  .welcome-text-container {
    top: 40%;
  }

  .enter-button-container {
    top: 50%;
  }
}

  </style>