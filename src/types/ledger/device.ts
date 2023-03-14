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
