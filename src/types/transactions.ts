import { EncodeObject } from '@cosmjs/proto-signing';

export interface Message extends EncodeObject {
  readonly index: number;
}

/**
 * Generic message that has been broadcast previously and fetched from the chain.
 */
export interface Transaction {
  readonly hash: string;
  readonly success: boolean;
  readonly timestamp: string;
  readonly messages: Message[];
}

/**
 * Group of transactions that has been grouped by date.
 */
export interface GroupedTransactions {
  readonly date: string;
  readonly transactions: Transaction[];
}
