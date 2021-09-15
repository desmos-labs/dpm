import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import en from './en.json';
import it from './it.json';

export const defaultNS = 'translation'
export const resources = {
    en: {
        translation: en,
    },
    it: {
        translation: it,
    }
};

i18n.use(initReactI18next).init({
    lng: 'en',
    ns: [defaultNS],
    fallbackLng: 'en',
    defaultNS,
    resources,
    debug: true,
    interpolation: {
        escapeValue: false // react already safes from xss
    }
});

export default i18n;
