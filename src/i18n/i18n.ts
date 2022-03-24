import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import i18n from 'i18next';
import { useCallback } from 'react';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import it from './it.json';

export const defaultNS = 'translation';
export const resources = {
  en: {
    translation: en,
  },
  it: {
    translation: it,
  },
};

export function useInitI18n(): () => Promise<void> {
  return useCallback(async () => {
    await i18n
      .use(RNLanguageDetector)
      .use(initReactI18next)
      .init({
        ns: [defaultNS],
        fallbackLng: 'en',
        defaultNS,
        resources,
        debug: false,
        interpolation: {
          escapeValue: false, // react already safes from xss
        },
      });
  }, []);
}
