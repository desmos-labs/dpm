import { LedgerApp } from 'types/ledger';
import { CosmosHdPath, DesmosHdPath } from 'types/chainsHdPaths';
import { cosmosIcon, cryptoOrgIcon, desmosIcon } from 'assets/images';

export const DesmosLedgerApp: LedgerApp = {
  name: 'Desmos',
  icon: desmosIcon,
  uiName: 'Desmos',
  minVersion: '2.18.2',
  masterHdPath: DesmosHdPath,
};

export const CosmosLedgerApp: LedgerApp = {
  name: 'Cosmos',
  icon: cosmosIcon,
  uiName: 'Cosmos',
  minVersion: '1.5.3',
  masterHdPath: CosmosHdPath,
};

export const CryptoOrgLedgerApp: LedgerApp = {
  name: 'Crypto.org',
  icon: cryptoOrgIcon,
  uiName: 'Crypto.org',
  minVersion: '2.16.5',
  masterHdPath: CosmosHdPath,
};

export const LedgerApps: LedgerApp[] = [DesmosLedgerApp, CosmosLedgerApp, CryptoOrgLedgerApp];
