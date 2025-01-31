import { createI18n } from 'vue-i18n';

import localePL from './locales/pl.json';
import localeEN from './locales/en.json';

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'pl',
  legacy: false,

  messages: {
    pl: localePL,
    en: localeEN,
  },
});

export default i18n;
