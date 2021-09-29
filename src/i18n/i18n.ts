import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import en from './en.json';
import it from './it.json';
import {useCallback} from "react";

export const defaultNS = 'translation'
export const resources = {
    en: {
        translation: en,
    },
    it: {
        translation: it,
    }
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
                debug: true,
                interpolation: {
                    escapeValue: false // react already safes from xss
                }
            });
    }, [])
}
