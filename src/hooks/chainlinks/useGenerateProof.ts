import {serializeSignDoc, StdSignDoc} from '@cosmjs/amino';
import {fromBase64, toHex} from '@cosmjs/encoding';
import {isOfflineDirectSigner, OfflineSigner} from '@cosmjs/proto-signing';
import {
  Bech32Address,
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import {PubKey} from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import {SignDoc, TxBody} from 'cosmjs-types/cosmos/tx/v1beta1/tx';
import {Any} from 'cosmjs-types/google/protobuf/any';
import Long from 'long';
import {LinkableChain} from 'types/chain';

export type GenerateProofConfig = {
  desmosAddress: string;
  externalAddress: string;
  externalChainWallet: OfflineSigner;
  chain: LinkableChain;
};

/**
 * Generates the proof used to signal that an user own an external chain address.
 */
const useGenerateProof = () => async (config: GenerateProofConfig) => {
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
        }),
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
      typeUrl: '/desmos.profiles.v3.SingleSignature',
      value: SingleSignature.encode(
        SingleSignature.fromPartial({
          valueType: isOfflineDirectSigner(externalChainWallet) ?
            SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT :
            SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO,
          signature,
        }),
      ).finish(),
    }),
    plainText: toHex(plainTextBytes),
    pubKey: Any.fromPartial({
      typeUrl: '/cosmos.crypto.secp256k1.PubKey',
      value: PubKey.encode(
        PubKey.fromPartial({
          key: pubKey,
        }),
      ).finish(),
    }),
  });
  const { chainConfig } = chain;
  const chainAddress = Any.fromPartial({
    typeUrl: '/desmos.profiles.v3.Bech32Address',
    value: Bech32Address.encode(
      Bech32Address.fromPartial({
        value: externalAddress,
        prefix: chain.prefix,
      }),
    ).finish(),
  });

  return {
    proof,
    chainConfig,
    chainAddress,
  };
};

export default useGenerateProof;
