import { createApp, type Directive } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';

import './style.css';
import i18n from './i18n';

const pinia = createPinia();

const clickOutsideDirective: Directive = {
  mounted(el, binding) {
    el.clickOutsideEvent = (event: Event) => {
      if (!(el == event.target || el.contains(event.target))) {
        binding.value();
      }
    };

    document.addEventListener('click', el.clickOutsideEvent);
  },
};

createApp(App).use(i18n).use(pinia).directive('click-outside', clickOutsideDirective).mount('#app');
