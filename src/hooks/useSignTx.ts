import { encodeSecp256k1Pubkey, OfflineAminoSigner, StdSignDoc } from '@cosmjs/amino';
import { fromBase64, toHex } from '@cosmjs/encoding';
import {
  encodePubkey,
  isOfflineDirectSigner,
  makeAuthInfoBytes,
  OfflineDirectSigner,
  OfflineSigner,
} from '@cosmjs/proto-signing';
import { SignMode } from 'cosmjs-types/cosmos/tx/signing/v1beta1/signing';
import { AuthInfo, SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { useCallback } from 'react';
import { CosmosMethod, CosmosSignDocDirect } from '../types/jsonRpCosmosc';
import { CosmosTx, SignedCosmosTx } from '../types/tx';

async function signDirectTx(
  signDoc: CosmosSignDocDirect,
  signer: OfflineSigner
): Promise<SignedCosmosTx> {
  if (!isOfflineDirectSigner(signer)) {
    throw new Error("Can't sign, method direct is not supported from the wallet");
  }
  const directSigner: OfflineDirectSigner = signer;
  const account = (await directSigner.getAccounts())[0];

  // Parse the auth info
  const { authInfo } = signDoc;
  // Generate the direct pubkey
  const cosmosPubKey = encodePubkey(encodeSecp256k1Pubkey(account.pubkey));
  // Generate the auth info
  const authInfoBytesWithSigner = makeAuthInfoBytes(
    [
      {
        pubkey: cosmosPubKey,
        sequence: authInfo.signerInfos[0].sequence.toNumber(),
      },
    ],
    authInfo.fee?.amount!,
    authInfo.fee?.gasLimit!.toNumber(),
    SignMode.SIGN_MODE_DIRECT
  );

  const bodyBytes = TxBody.encode(signDoc.body).finish();

  // Create the SignDoc that will be signed
  const finalSignDoc = SignDoc.fromPartial({
    chainId: signDoc.chainId,
    accountNumber: signDoc.accountNumber,
    bodyBytes,
    authInfoBytes: authInfoBytesWithSigner,
  });

  // Sign the document
  const signature = await directSigner.signDirect(account.address, finalSignDoc);
  return {
    method: CosmosMethod.SignDirect,
    tx: {
      body: signDoc.body,
      chainId: signDoc.chainId,
      accountNumber: signDoc.accountNumber,
      authInfo: AuthInfo.decode(authInfoBytesWithSigner),
    },
    signature: toHex(fromBase64(signature.signature.signature)),
  };
}

async function signAminoTx(signDoc: StdSignDoc, signer: OfflineSigner): Promise<SignedCosmosTx> {
  const aminoSigner: OfflineAminoSigner = signer as OfflineAminoSigner;

  if (aminoSigner.signAmino === undefined) {
    throw new Error("Can't sign, method amino is not supported from the wallet");
  }

  const account = (await aminoSigner.getAccounts())[0];
  const signResult = await aminoSigner.signAmino(account.address, signDoc);

  return {
    method: CosmosMethod.SignAmino,
    tx: signDoc,
    signature: signResult.signature.signature,
  };
}

/**
 * Hook to sign a Cosmos transaction
 * Returns a stateful variable that provides the signing status and a function to initiate the signing procedure.
 */
export default function useSignTx(): (
  wallet: OfflineSigner,
  tx: CosmosTx
) => Promise<SignedCosmosTx> {
  return useCallback(async (wallet: OfflineSigner, tx: CosmosTx) => {
    switch (tx.method) {
      case CosmosMethod.SignAmino:
        return signAminoTx(tx.tx, wallet);

      case CosmosMethod.SignDirect:
        return signDirectTx(tx.tx, wallet);
      default:
        return {} as never;
    }
  }, []);
}
