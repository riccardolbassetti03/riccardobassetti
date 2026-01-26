import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './firebase'
import { createPinia } from 'pinia';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App)

window.router = router;
createApp(App).use(router).mount('#app')

const pinia = createPinia();
app.use(pinia);
app.use(router);

app.mount('#app');