import { createRouter, createWebHashHistory } from 'vue-router'
import LoginPage from '@/views/LoginPage.vue'
import RegisterPage from '@/views/RegisterPage.vue'
import HomePage from '@/views/HomePage.vue'
import GalleryPage from '@/views/GalleryPage.vue'
import CartPage from '@/views/CartPage.vue'
import GamePage from '@/views/GamePage.vue'
import ProductPage from '@/views/ProductPage.vue';
import SecretPage from '@/views/SecretPage.vue';
import AboutUs from '@/views/AboutPage.vue';

const routes = [

  {
    path: '/login',
    name: 'LoginPage',
    component: LoginPage,
    meta: { title: 'Login - Orderly' }
  },
  {
    path: '/',
    name: 'GalleryPage',
    component: GalleryPage,
    meta: { title: 'Orderly' }
  },
  {
    path: '/secret',
    name: 'SecretPage',
    component: SecretPage,
    meta: { title: 'Secret - Orderly' }
  },
  {
    path: '/home',
    name: 'HomePage',
    component: HomePage,
    meta: { title: 'Home - Orderly' }
  },
  {
    path: '/register',
    name: 'RegisterPage',
    component: RegisterPage,
    meta: { title: 'Register - Orderly' }
  },
  {
    path: '/product/:name/:id',
    name: 'ProductPage',
    component: ProductPage,
    meta: { title: 'Product - Orderly' }
  },
  {
    path: '/cart',
    name: 'CartPage',
    component: CartPage,
    meta: { title: 'Cart - Orderly' }
  },
  {
    path: '/SecretPage',
    name: 'GamePage',
    component: GamePage,
    meta: { title: '??? - Orderly' }

  },
  {
    path: '/about',
    name: 'AboutUs',
    component: AboutUs,
    meta: { title: 'Info - Orderly' }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Orderly';
  next();
});

export default router
