import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import './style.css';
import i18n from './i18n';

const pinia = createPinia();

createApp(App).use(i18n).use(pinia).mount('#app');
