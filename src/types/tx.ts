import { StdFee, StdSignDoc } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { CosmosMethod, CosmosSignDocDirect } from './jsonRpCosmosc';

export type CosmosAminoTx = {
  method: CosmosMethod.SignAmino;
  tx: StdSignDoc;
};

export type CosmosDirectTx = {
  method: CosmosMethod.SignDirect;
  tx: CosmosSignDocDirect;
};

export type CosmosTx = CosmosAminoTx | CosmosDirectTx;

export type SignedCosmosTx = CosmosTx & { signature: string };

export type BroadcastedTx = {
  hash: string;
  msgs: EncodeObject[];
  fee: StdFee;
  memo: string;
  success: boolean;
  timestamp: string;
};
