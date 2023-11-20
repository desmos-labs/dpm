import { EncodeObject } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/amino';
import { Coin } from '@desmoslabs/desmjs';

/**
 * Generic message contained inside a transaction.
 */
export interface Message extends EncodeObject {}

/**
 * Transaction that has been previously broadcast.
 */
export interface Transaction {
  readonly messages: Message[];
  readonly hash: string;
  readonly success: boolean;
  readonly timestamp: string;
  readonly fee: StdFee;
  readonly memo?: string;
}

/**
 * Type that represents the messages contained in a transaction
 * obtained from GQL.
 */
export interface GQLRawMessage extends Record<string, any> {
  readonly '@type': string;
}

/**
 * Interface that represents a transaction fee obtained from GQL.
 */
export interface GQLTransactionFee {
  readonly amount: Coin[];
  readonly gas_limit: string;
  readonly payer?: string;
  readonly granter?: string;
}

/**
 * Interface that represents a transaction obtained from GQL.
 */
interface GQLTransaction {
  readonly messages: GQLRawMessage[];
  readonly hash: string;
  readonly success: boolean;
  readonly block: {
    readonly timestamp: string;
  };
  readonly fee: GQLTransactionFee;
  readonly memo?: string;
}

/**
 * Interface that represents a messages obtained from GQL.
 */
export interface GQLMessage {
  transaction: GQLTransaction;
}

/**
 * Interface that represents the result of the `GetTransactionsByAddress` query.
 */
export interface GQLGetTransactionsByAddress {
  messages: GQLMessage[];
}
