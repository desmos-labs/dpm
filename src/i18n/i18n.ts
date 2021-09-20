import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import RNLanguageDetector from '@os-team/i18next-react-native-language-detector';
import en from './en.json';
import it from './it.json';
import {useEffect, useState} from "react";
import Deferred from "../types/defered";

export const defaultNS = 'translation'
export const resources = {
    en: {
        translation: en,
    },
    it: {
        translation: it,
    }
};

export function useInitI18n() {
    const [status, setStatus] = useState<Deferred<any>>(Deferred.pending());

    useEffect(() => {
        i18n
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
            }).then(() => {
                console.log("completed")
                setStatus(Deferred.completed({}));
            }).catch(e => Deferred.failed(e.toString()))
    }, [])

    return status;
}
