import { LedgerApp } from 'types/ledger';

export const DesmosLedgerApp: LedgerApp = {
  name: 'Desmos',
  icon: require('../assets/images/chains/desmos.png'),
  uiName: 'Desmos',
  minVersion: '2.18.2',
};

export const CosmosLedgerApp: LedgerApp = {
  name: 'Cosmos',
  icon: require('../assets/images/chains/cosmos.png'),
  uiName: 'Cosmos',
  minVersion: '1.5.3',
};

export const CryptoOrgLedgerApp: LedgerApp = {
  name: 'Crypto.org',
  icon: require('assets/images/chains/cryptoOrg.png'),
  uiName: 'Crypto.org',
  minVersion: '2.16.5',
};

export const TerraLedgerApp: LedgerApp = {
  name: 'Terra',
  icon: require('../assets/images/chains/terra.png'),
  uiName: 'Terra',
  minVersion: '1.0.0',
};

export const LedgerApps: LedgerApp[] = [CosmosLedgerApp, CryptoOrgLedgerApp, TerraLedgerApp];
