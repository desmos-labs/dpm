import {CosmosMethod, CosmosSignDocDirect} from './jsonRpCosmosc';
import {StdSignDoc} from '@cosmjs/amino';

export type CosmosAminoTx = {
    method: CosmosMethod.SignAmino;
    tx: StdSignDoc;
};

export type CosmosDirectTx = {
    method: CosmosMethod.SignDirect;
    tx: CosmosSignDocDirect;
};

export type CosmosTx = CosmosAminoTx | CosmosDirectTx;


export type SignedCosmosTx = CosmosTx & {signature: string}