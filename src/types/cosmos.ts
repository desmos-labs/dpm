// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for the list of all slips.
import {Pubkey, StdFee, StdSignDoc} from '@cosmjs/amino';
import {CosmosSignDocDirect} from 'types/walletConnect';
import {EncodeObject} from '@cosmjs/proto-signing';

export enum TxType {
  SignAmino,
  SignDirect,
}

export type CosmosAminoTx = {
  method: TxType.SignAmino;
  tx: StdSignDoc;
  pubKey: Pubkey;
};

export type CosmosDirectTx = {
  method: TxType.SignDirect;
  tx: CosmosSignDocDirect;
};

export type CosmosTx = CosmosAminoTx | CosmosDirectTx;

export type SignedCosmosTx = CosmosTx & {
  signature: string;
};

export type BroadcastTx = {
  hash: string;
  msgs: EncodeObject[];
  fee: StdFee;
  memo: string;
  success: boolean;
  timestamp: string;
};
