import { Algo } from '@cosmjs/amino';
import { WalletType } from 'types/wallet';

/**
 * Interface representing a user account.
 */
export interface Account {
  /**
   * Type of the wallet associated with this account.
   */
  readonly walletType: WalletType,
  /**
   * Account bech32 address.
   */
  readonly address: string,
  /**
   * Account public key.
   */
  readonly pubKey: Uint8Array,
  /**
   * Account public key type.
   */
  readonly algo: Algo
}
