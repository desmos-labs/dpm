import { Coin } from '@desmoslabs/desmjs';

/**
 * Interface that represents a user delegation.
 */
export interface Delegation {
  coins: Coin[];
  validatorAddress: string;
}
