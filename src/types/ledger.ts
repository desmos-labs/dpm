import { ImageSourcePropType } from 'react-native';

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
  name: string;
  /**
   * Application icon to be displayed to the user.
   */
  icon: ImageSourcePropType;
  /**
   * Name to be displayed to the user.
   */
  uiName: string;
  /**
   * Min ledger application version.
   */
  minVersion: string;
}
