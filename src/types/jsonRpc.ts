import { JsonRpcRequest } from '@json-rpc-tools/types/dist/cjs/jsonrpc';
import { CosmosMethod, CosmosSignAminoParams, CosmosSignDirectParams } from './jsonRpCosmosc';

export interface SignDirectRequest extends JsonRpcRequest<CosmosSignDirectParams> {
  method: CosmosMethod.SignDirect;
  params: CosmosSignDirectParams;
}

export interface SignAminoRequest extends JsonRpcRequest<CosmosSignAminoParams> {
  method: CosmosMethod.SignAmino;
  params: CosmosSignAminoParams;
}

export type RpcRequest = SignAminoRequest | SignDirectRequest;
