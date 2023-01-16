import { Coin } from '@cosmjs/amino';

export interface QueriedMessage {
  readonly tx: {
    readonly hash: string;
    readonly success: boolean;
    readonly timestamp: string;
    readonly memo?: string;
    readonly fee?: {
      readonly payer: string;
      readonly amount: Coin[];
      readonly granter: string;
      readonly gas_limit: string;
    };
  };

  readonly index: number;
  readonly type: string;
  readonly value: any;
}
