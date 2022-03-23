import { useDesmosClient } from '@desmoslabs/sdk-react';
import { useCallback } from 'react';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import { StdFee } from '@cosmjs/amino';
import { isBroadcastTxFailure } from '@desmoslabs/sdk-core';
import Long from 'long';
import { SignerInfo, AuthInfo, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';

function makeSignerInfo(
  signer: { readonly pubkey: Any; readonly sequence: number },
  signMode: SignMode
): SignerInfo {
  return SignerInfo.fromPartial({
    publicKey: signer.pubkey,
    modeInfo: {
      single: {
        mode: signMode,
      },
    },
    sequence: Long.fromNumber(signer.sequence),
  });
}

export function makeAuthInfoBytes(
  signer: { readonly pubkey: Any; readonly sequence: number },
  feeAmount: readonly Coin[],
  gasLimit: number,
  signMode: SignMode,
  granter?: string
): Uint8Array {
  return AuthInfo.encode(
    AuthInfo.fromPartial({
      signerInfos: [makeSignerInfo(signer, signMode)],
      fee: {
        amount: [...feeAmount],
        gasLimit: Long.fromNumber(gasLimit),
        granter,
      },
    })
  ).finish();
}

/**
 * Hook that returns a function that create a transaction with the provided
 * messages and sign that with the provided signer.
 * If the transactions fails will be raised an Error.
 */
export default function useBroadcastMessages() {
  const client = useDesmosClient();

  return useCallback(
    async (
      signer: OfflineSigner,
      messages: EncodeObject[],
      fee: StdFee,
      memo?: string,
      granter?: string
    ) => {
      client.setSigner(signer);
      await client.connect();
      const signerAddress = await signer.getAccounts();
      const signed = await client.sign(
        signerAddress[0].address,
        messages,
        fee,
        memo ?? '',
        undefined,
        granter
      );
      const broadcastResult = await client.broadcastTx(TxRaw.encode(signed).finish());
      if (isBroadcastTxFailure(broadcastResult)) {
        throw new Error(broadcastResult.rawLog ?? 'Unknown error');
      }
    },
    [client]
  );
}
