import { EncodeObject } from '@cosmjs/proto-signing';
import { Fee } from 'cosmjs-types/cosmos/tx/v1beta1/tx';

/**
 * Generic message contained inside a transaction.
 */
export interface Message extends EncodeObject {
  readonly index: number;
}

/**
 * Transaction that has been previously broadcast.
 */
export interface Transaction {
  readonly hash: string;
  readonly success: boolean;
  readonly timestamp: string;
  readonly messages: Message[];
  readonly memo?: string;
  readonly fee?: Fee;
}

/**
 * Group of transactions that has been grouped by date.
 */
export interface GroupedTransactions {
  readonly date: string;
  readonly transactions: Transaction[];
}
