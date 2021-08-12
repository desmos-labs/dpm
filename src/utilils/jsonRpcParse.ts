import {JsonRpcRequest} from '@json-rpc-tools/utils';
import {
    CosmosMethod,
    CosmosSignAminoParams,
    CosmosSignDirectParams,
} from '../types/jsonRpCosmosc';
import {Coin} from '@cosmjs/amino';
import {AminoMsg} from '@cosmjs/amino/build/signdoc';
import {RpcRequest} from '../types/jsonRpc';

export function parseSignAminoParams(
    request: JsonRpcRequest,
): CosmosSignAminoParams | null {
    const signAddress: string | undefined = request.params?.signerAddress;
    const signDoc: any | undefined = request.params?.signDoc;
    const chainId: string | undefined = signDoc?.chain_id;
    const accountNumber: string | undefined = signDoc?.account_number;
    const sequence: string | undefined = signDoc?.sequence;
    const memo: string = signDoc?.memo ?? '';
    const fee: any | undefined = signDoc?.fee;
    const gas: string | undefined = fee?.gas;
    const amount: (Coin | null)[] | undefined = fee?.amount?.map(
        (coin: any) => {
            if (
                typeof coin?.denom === 'string' &&
                typeof coin?.amount === 'string'
            ) {
                return coin as Coin;
            } else {
                return null;
            }
        },
    );
    const msgs: (AminoMsg | null)[] | undefined = signDoc?.msgs?.map(
        (m: any) => {
            if (typeof m.type === 'string' && typeof m.value === 'object') {
                return {
                    type: m.type,
                    value: m.value,
                };
            } else {
                return null;
            }
        },
    );

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
        signerAddress: signAddress!!,
        signDoc: {
            chain_id: chainId,
            account_number: accountNumber,
            sequence: sequence,
            fee: {
                amount: amount as Coin[],
                gas: gas,
            },
            memo: memo,
            msgs: msgs as AminoMsg[],
        },
    };
}

export function parseSignDirectParams(
    request: JsonRpcRequest,
): CosmosSignDirectParams | null {
    const signAddress: string | undefined = request.params?.signerAddress;
    const signDoc: any | undefined = request.params?.signDoc;
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
        console.error(
            `Malformed sign direct ${JSON.stringify(request.params)}`,
        );
        return null;
    }

    return {
        signerAddress: signAddress,
        signDoc: {
            chainId: chainId,
            accountNumber: accountNumber,
            authInfoBytes: authInfo,
            bodyBytes: body,
        },
    };
}

export default function parseRpcRequest(
    request: JsonRpcRequest,
): RpcRequest | null {
    if (request.method === 'cosmos_signDirect') {
        const params = parseSignDirectParams(request);
        if (params === null) {
            console.error(
                'Error while parsing params of: ' + CosmosMethod.SignDirect,
            );
            return null;
        }
        return {
            ...request,
            method: CosmosMethod.SignDirect,
            params: params!,
        };
    } else if (request.method === CosmosMethod.SignAmino) {
        const params = parseSignAminoParams(request);
        if (params === null) {
            console.error(
                'Error while parsing params of: ' + CosmosMethod.SignAmino,
            );
            return null;
        }
        return {
            ...request,
            method: CosmosMethod.SignAmino,
            params: params!,
        };
    } else {
        console.error('Unknown rpc request: ' + request.method);
        return null;
    }
}
