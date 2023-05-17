import { Coin } from '@desmoslabs/desmjs';

/**
 * Interface that represents a user delegation.
 */
export interface Delegation {
  coins: Coin[];
  validatorAddress: string;
}

/**
 * Interface that represents a pending stacking reward that
 * can be claimed from a validator.
 */
export interface PendingReward {
  coins: Coin[];
  validatorAddress: string;
}

/**
 * Interface that represents a user redelegation from a validator to another.
 */
export interface Redelegation {
  delegatorAddress: string;
  validatorDstAddress: string;
  validatorSrcAddress: string;
  balance: string;
  completionTime: Date;
}
