import {LinkableChain} from "../types/chain";
import {useCallback} from "react";
import LocalWallet from "../wallet/LocalWallet";
import {Bech32Address, Proof} from "@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links";
import {toHex} from "@cosmjs/encoding";
import {Buffer} from "buffer";
import {Any} from "cosmjs-types/google/protobuf/any";
import {PubKey} from "cosmjs-types/cosmos/crypto/secp256k1/keys";
import {ChainLinkProof} from "../types/link";

export type GenerateProofConfig = {
    externalChainWallet: LocalWallet,
    chain: LinkableChain,
}

/**
 * Hook that provides a function to generate the proof to link an external chain account
 * to the a Desmos profile.
 */
export default function useGenerateProof(): (config: GenerateProofConfig) => Promise<ChainLinkProof> {
    return useCallback(async (config: GenerateProofConfig) => {
        const {externalChainWallet, chain} = config;

        const addressBinary = Uint8Array.from(Buffer.from(externalChainWallet.bech32Address, "utf-8"));
        const signature = await externalChainWallet.sign(addressBinary);
        const proof = Proof.fromPartial({
            signature: toHex(signature),
            plainText: toHex(addressBinary),
            pubKey: Any.fromPartial({
                typeUrl: "/cosmos.crypto.secp256k1.PubKey",
                value: PubKey.encode(PubKey.fromPartial({
                    key: externalChainWallet.publicKey,
                })).finish(),
            })
        });
        const chainConfig = chain.chainConfig;
        const chainAddress = Any.fromPartial({
            typeUrl: "/desmos.profiles.v1beta1.Bech32Address",
            value: Bech32Address.encode(Bech32Address.fromPartial({
                value: externalChainWallet.bech32Address,
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