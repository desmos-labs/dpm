// import the original type declarations
import 'i18next';

// i18next module type definitions.
declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
    nsSeparator: ':';
  }
}
