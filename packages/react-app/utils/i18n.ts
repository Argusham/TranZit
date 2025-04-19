// src/lib/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend) // load translations via HTTP
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass i18n instance to react-i18next
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'af', 'xh'],
    ns: ['default'],
    defaultNS: 'default',
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: '/locales/{{lng}}.json', // flat structure
    },
    detection: {
      order: ['cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['cookie'],
    },
  });

export default i18n;
