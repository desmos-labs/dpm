import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import { defaultNS, nameSpaces, resources } from './config';

i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng: 'en',
    defaultNS,
    keySeparator: 'false',
    returnNull: false,
    ns: nameSpaces,
    resources,
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v4',
  })
  .then(() => {});
