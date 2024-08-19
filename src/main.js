// import './assets/main.css';
import './assets/all.scss';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(VueAxios,axios);

app.mount('#app')
