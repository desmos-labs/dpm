import { StdFee } from '@cosmjs/amino';
import { EncodeObject, OfflineSigner } from '@cosmjs/proto-signing';
import { isBroadcastTxFailure } from '@desmoslabs/sdk-core';
import { useDesmosClient } from '@desmoslabs/sdk-react';
import { Coin } from 'cosmjs-types/cosmos/base/v1beta1/coin';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { AuthInfo, SignerInfo, TxRaw } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import Long from 'long';
import { useCallback } from 'react';
import SignerWrapper from '../utilils/offlinesignerwrapper';
import useDesmosClient from './desmosclient/useDesmosClient';

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
    async (signer: OfflineSigner, messages: EncodeObject[], fee: StdFee, memo?: string) => {
      const wrapper = new SignerWrapper(signer);
      client!.setSigner(wrapper);
      const signerAddress = await signer.getAccounts();
      const signed = await client!.sign(
        signerAddress[0].address,
        messages,
        fee,
        memo ?? '',
        undefined
      );
      const broadcastResult = await client.broadcastTx(TxRaw.encode(signed).finish());
      if (isBroadcastTxFailure(broadcastResult)) {
        throw new Error(broadcastResult.rawLog ?? 'Unknown error');
      }
    },
    [client]
  );
}
