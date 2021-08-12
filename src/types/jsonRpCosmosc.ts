import {StdSignDoc} from '@cosmjs/amino';

export type CosmosPubKey = {
    type: string;
    value: string;
};

export type CosmosSignature = {
    pub_key?: CosmosPubKey;
    signature: string;
};

export enum CosmosMethod {
    SignDirect = 'cosmos_signDirect',
    SignAmino = 'cosmos_signAmino',
}

export type CosmosSignDocDirect = {
    chainId: string;
    accountNumber: string;
    authInfoBytes: string;
    bodyBytes: string;
};

export type CosmosSignDirectParams = {
    signerAddress: string;
    signDoc: CosmosSignDocDirect;
};

export type CosmosSignDirectResult = {
    signature: CosmosSignature;
    signed: CosmosSignDocDirect;
};

export type CosmosSignAminoParams = {
    signerAddress: string;
    signDoc: StdSignDoc;
};

export type CosmosSignAminoResult = {
    signature: CosmosSignature;
    signed: StdSignDoc;
};
