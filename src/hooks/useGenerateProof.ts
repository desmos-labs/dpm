import {LinkableChain} from "../types/chain";
import {useCallback} from "react";
import {Bech32Address, Proof} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links";
import {fromBase64, toHex} from "@cosmjs/encoding";
import {Any} from "cosmjs-types/google/protobuf/any";
import {PubKey} from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import {ChainLinkProof} from "../types/link";
import {isOfflineDirectSigner, OfflineSigner} from "@cosmjs/proto-signing";
import Long from "long";
import {SignDoc, TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {serializeSignDoc, StdSignDoc} from "@cosmjs/amino";

export type GenerateProofConfig = {
    signerAddress: string,
    externalChainWallet: OfflineSigner,
    chain: LinkableChain,
}

/**
 * Hook that provides a function to generate the proof to link an external chain account
 * to the a Desmos profile.
 */
export default function useGenerateProof(): (config: GenerateProofConfig) => Promise<ChainLinkProof> {

    return useCallback(async (config: GenerateProofConfig) => {
        const {signerAddress, externalChainWallet, chain} = config;

        let signature: Uint8Array;
        let plainTextBytes: Uint8Array;
        let pubKey: Uint8Array;
        if (isOfflineDirectSigner(externalChainWallet)) {
            const signDoc = SignDoc.fromPartial({
                accountNumber: Long.ZERO,
                authInfoBytes: new Uint8Array(),
                bodyBytes: TxBody.encode(TxBody.fromPartial({
                    memo: signerAddress
                })).finish(),
                chainId: ''
            })
            plainTextBytes = SignDoc.encode(signDoc).finish();
            const result = await externalChainWallet.signDirect(signerAddress, signDoc);
            signature = fromBase64(result.signature.signature);
            pubKey = fromBase64(result.signature.pub_key.value);
        } else {
            const signDoc: StdSignDoc = {
                chain_id: '',
                fee: {
                    gas: '0',
                    amount: [],
                },
                memo: signerAddress,
                msgs: [],
                sequence: '0',
                account_number: '0'
            }
            plainTextBytes = serializeSignDoc(signDoc);
            const result = await externalChainWallet.signAmino(signerAddress, signDoc);
            signature = fromBase64(result.signature.signature);
            pubKey = fromBase64(result.signature.pub_key.value);
        }


        const proof = Proof.fromPartial({
            signature: toHex(signature),
            plainText: toHex(plainTextBytes),
            pubKey: Any.fromPartial({
                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                value: PubKey.encode(PubKey.fromPartial({
                    key: pubKey,
                })).finish(),
            })
        });
        const chainConfig = chain.chainConfig;
        const chainAddress = Any.fromPartial({
            typeUrl: "/desmos.profiles.v1beta1.Bech32Address",
            value: Bech32Address.encode(Bech32Address.fromPartial({
                value: signerAddress,
                prefix: chain.prefix
            })).finish(),
        });


        return {
            proof,
            chainConfig,
            chainAddress
        }
    }, [])
}