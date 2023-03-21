// import the original type declarations
import 'i18next';
import { defaultNS, resources } from './config';
import bank from './en/messages/bank.json';
import feegrant from './en/messages/feegrant.json';
import gov from './en/messages/gov.json';
import profiles from './en/messages/profiles.json';
import staking from './en/messages/staking.json';
import unknown from './en/messages/unknown.json';

// i18next module type definitions.
declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: typeof resources['en'] & {
      'messages.bank': typeof bank;
      'messages.feegrant': typeof feegrant;
      'messages.gov': typeof gov;
      'messages.profiles': typeof profiles;
      'messages.staking': typeof staking;
      'messages.unknown': typeof unknown;
    };
    returnNull: false;
  }
}
