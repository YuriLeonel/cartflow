import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import ptBR from './locales/pt-BR.json';

i18n.use(initReactI18next).init({
  resources: {
    'pt-BR': { translation: ptBR },
  },
  lng: Localization.getLocales()?.[0]?.languageTag ?? 'pt-BR',
  fallbackLng: 'pt-BR',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
