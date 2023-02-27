// import the original type declarations
import 'i18next';
import { defaultNS, resources } from './config';

// i18next module type definitions.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'];
    returnNull: false;
  }
}
