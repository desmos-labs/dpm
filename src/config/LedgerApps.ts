import { LedgerApp } from 'types/ledger';
import { CosmosHdPath, DesmosHdPath } from 'types/chainsHdPaths';

export const DesmosLedgerApp: LedgerApp = {
  name: 'Desmos',
  icon: require('../assets/images/chains/desmos.png'),
  uiName: 'Desmos',
  minVersion: '2.18.2',
  masterHdPath: DesmosHdPath,
};

export const CosmosLedgerApp: LedgerApp = {
  name: 'Cosmos',
  icon: require('../assets/images/chains/cosmos.png'),
  uiName: 'Cosmos',
  minVersion: '1.5.3',
  masterHdPath: CosmosHdPath,
};

export const CryptoOrgLedgerApp: LedgerApp = {
  name: 'Crypto.org',
  icon: require('assets/images/chains/cryptoOrg.png'),
  uiName: 'Crypto.org',
  minVersion: '2.16.5',
  masterHdPath: CosmosHdPath,
};

export const LedgerApps: LedgerApp[] = [DesmosLedgerApp, CosmosLedgerApp, CryptoOrgLedgerApp];
