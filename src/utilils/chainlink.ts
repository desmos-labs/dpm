import { serializeSignDoc, StdSignDoc } from '@cosmjs/amino';
import { fromBase64, toHex } from '@cosmjs/encoding';
import { isOfflineDirectSigner, OfflineSigner } from '@cosmjs/proto-signing';
import { SignMode } from '@desmoslabs/desmjs-types/cosmos/tx/signing/v1beta1/signing';
import {
  Bech32Address,
  Proof,
  SingleSignatureData,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import { SignDoc, TxBody } from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import { Any } from 'cosmjs-types/google/protobuf/any';
import Long from 'long';
import { LinkableChain } from '../types/chain';
import { ChainLinkProof } from '../types/link';

export type GenerateProofConfig = {
  desmosAddress: string;
  externalAddress: string;
  externalChainWallet: OfflineSigner;
  chain: LinkableChain;
};

/**
 * Generates the proof used to signal that an user own an external chain address.
 */
export async function generateProof(config: GenerateProofConfig): Promise<ChainLinkProof> {
  const { desmosAddress, externalAddress, externalChainWallet, chain } = config;
  let signature: Uint8Array;
  let plainTextBytes: Uint8Array;
  let pubKey: Uint8Array;

  if (isOfflineDirectSigner(externalChainWallet)) {
    const signDoc = SignDoc.fromPartial({
      accountNumber: Long.ZERO,
      authInfoBytes: new Uint8Array(),
      bodyBytes: TxBody.encode(
        TxBody.fromPartial({
          memo: desmosAddress,
        })
      ).finish(),
      chainId: '',
    });
    plainTextBytes = SignDoc.encode(signDoc).finish();
    const result = await externalChainWallet.signDirect(externalAddress, signDoc);
    signature = fromBase64(result.signature.signature);
    pubKey = fromBase64(result.signature.pub_key.value);
  } else {
    const signDoc: StdSignDoc = {
      chain_id: '',
      fee: {
        gas: '0',
        amount: [],
      },
      memo: desmosAddress,
      msgs: [],
      sequence: '0',
      account_number: '0',
    };
    plainTextBytes = serializeSignDoc(signDoc);
    const result = await externalChainWallet.signAmino(externalAddress, signDoc);
    signature = fromBase64(result.signature.signature);
    pubKey = fromBase64(result.signature.pub_key.value);
  }

  const proof = Proof.fromPartial({
    signature: Any.fromPartial({
      typeUrl: '/desmos.profiles.v2.SingleSignatureData',
      value: SingleSignatureData.encode(
        SingleSignatureData.fromPartial({
          mode: isOfflineDirectSigner(externalChainWallet)
            ? SignMode.SIGN_MODE_DIRECT
            : SignMode.SIGN_MODE_LEGACY_AMINO_JSON,
          signature,
        })
      ).finish(),
    }),
    plainText: toHex(plainTextBytes),
    pubKey: Any.fromPartial({
      typeUrl: '/cosmos.crypto.secp256k1.PubKey',
      value: PubKey.encode(
        PubKey.fromPartial({
          key: pubKey,
        })
      ).finish(),
    }),
  });
  const { chainConfig } = chain;
  const chainAddress = Any.fromPartial({
    typeUrl: '/desmos.profiles.v2.Bech32Address',
    value: Bech32Address.encode(
      Bech32Address.fromPartial({
        value: externalAddress,
        prefix: chain.prefix,
      })
    ).finish(),
  });

  return {
    proof,
    chainConfig,
    chainAddress,
  };
}
