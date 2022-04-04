import { Coin } from '@cosmjs/amino';
import { AminoMsg } from '@cosmjs/amino/build/signdoc';
import { fromHex } from '@cosmjs/encoding';
import { AuthInfo, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import Long from 'long';
import {
  CosmosMethod,
  CosmosSignAminoParams,
  CosmosSignDirectParams,
} from '../types/jsonRpCosmosc';
import { CallRequest, CallRequestType, ParsedCallRequest } from '../types/walletconnect';

export function parseSignAminoParams(request: CallRequest): CosmosSignAminoParams | null {
  const param = request.params.length > 0 ? request.params[0] : undefined;
  const signAddress: string | undefined = param?.signerAddress;
  const signDoc: any | undefined = param?.signDoc;
  const chainId: string | undefined = signDoc?.chain_id;
  const accountNumber: string | undefined = signDoc?.account_number;
  const sequence: string | undefined = signDoc?.sequence;
  const memo: string = signDoc?.memo ?? '';
  const fee: any | undefined = signDoc?.fee;
  const gas: string | undefined = fee?.gas;
  const amount: (Coin | null)[] | undefined = fee?.amount?.map((coin: any) => {
    if (typeof coin?.denom === 'string' && typeof coin?.amount === 'string') {
      return coin as Coin;
    }
    return null;
  });
  const msgs: (AminoMsg | null)[] | undefined = signDoc?.msgs?.map((m: any) => {
    if (typeof m.type === 'string' && typeof m.value === 'object') {
      return {
        type: m.type,
        value: m.value,
      };
    }
    return null;
  });

  // Check validity
  if (
    signAddress === undefined ||
    signDoc === undefined ||
    chainId === undefined ||
    accountNumber === undefined ||
    sequence === undefined ||
    fee === undefined ||
    msgs === undefined ||
    msgs.indexOf(null) >= 0 ||
    gas === undefined ||
    amount === undefined ||
    amount.indexOf(null) >= 0
  ) {
    console.error(`Malformed sign amino ${JSON.stringify(request.params)}`);
    return null;
  }

  return {
    signerAddress: signAddress!,
    signDoc: {
      chain_id: chainId,
      account_number: accountNumber,
      sequence,
      fee: {
        amount: amount as Coin[],
        gas,
      },
      memo,
      msgs: msgs as AminoMsg[],
    },
  };
}

export function parseSignDirectParams(request: CallRequest): CosmosSignDirectParams | null {
  const param = request.params.length > 0 ? request.params[0] : undefined;
  const signAddress: string | undefined = param?.signerAddress;
  const signDoc: any | undefined = param?.signDoc;
  const chainId: string | undefined = signDoc?.chainId;
  const accountNumber: string | undefined = signDoc?.accountNumber;
  const authInfo: string | undefined = signDoc?.authInfoBytes;
  const body: string | undefined = signDoc?.bodyBytes;

  if (
    signAddress === undefined ||
    signDoc === undefined ||
    chainId === undefined ||
    accountNumber === undefined ||
    authInfo === undefined ||
    body === undefined
  ) {
    console.error(`Malformed sign direct ${JSON.stringify(request.params)}`);
    return null;
  }

  return {
    signerAddress: signAddress,
    signDoc: {
      chainId,
      accountNumber: Long.fromString(accountNumber, 16),
      authInfo: AuthInfo.decode(fromHex(authInfo)),
      body: TxBody.decode(fromHex(body)),
    },
  };
}

export default function parseCallRequest(request: CallRequest): ParsedCallRequest | null {
  if (request.method === CallRequestType.SignDirect.toString()) {
    const params = parseSignDirectParams(request);
    if (params === null) {
      console.error(`Error while parsing params of: ${CosmosMethod.SignDirect}`);
      return null;
    }
    return {
      type: CallRequestType.SignDirect,
      sessionId: request.sessionId,
      requestId: request.id,
      signerAddress: params.signerAddress,
      signDoc: params.signDoc,
    };
  }
  if (request.method === CallRequestType.SignAmino.toString()) {
    const params = parseSignAminoParams(request);
    if (params === null) {
      console.error(`Error while parsing params of: ${CosmosMethod.SignAmino}`);
      return null;
    }
    return {
      type: CallRequestType.SignAmino,
      sessionId: request.sessionId,
      requestId: request.id,
      signerAddress: params.signerAddress,
      signDoc: params.signDoc,
    };
  }
  if (request.method === CallRequestType.GetAccounts.toString()) {
    return {
      type: CallRequestType.GetAccounts,
      sessionId: request.sessionId,
      requestId: request.id,
    };
  }
  console.error(`Unknown request method: ${request.method}`);
  return null;
}
