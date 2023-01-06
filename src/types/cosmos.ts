// See https://github.com/satoshilabs/slips/blob/master/slip-0044.md for the list of all slips.
import { Pubkey, StdSignDoc } from '@cosmjs/amino';
import { CosmosSignDocDirect } from 'types/walletConnect';

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
