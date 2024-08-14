// import './assets/main.css';
import router from './router';
import axios from 'axios';
import VueAxios from 'vue-axios';
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.use(router);
app.use(VueAxios,axios);

app.mount('#app')
