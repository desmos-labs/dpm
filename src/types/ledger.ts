import { ImageSourcePropType } from 'react-native';
import { HdPath } from '@cosmjs/crypto';

export type Subscription = {
  unsubscribe: () => void;
};

/**
 * Type that represents a Bluetooth Low Energy Ledger device.
 */
export type BLELedger = {
  id: string;
  name: string;
};

/**
 * Type that represents an application that can be installed on a Ledger device.
 */
export type LedgerApp = {
  /**
   * Ledger application name.
   */
  readonly name: string;
  /**
   * Application icon to be displayed to the user.
   */
  readonly icon: ImageSourcePropType;
  /**
   * Name to be displayed to the user.
   */
  readonly uiName: string;
  /**
   * Min ledger application version.
   */
  readonly minVersion: string;
  /**
   * hd path to use with this application to derive
   * the user's private key
   */
  readonly masterHdPath: HdPath;
};
