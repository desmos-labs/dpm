import {CosmosTx, SignedCosmosTx} from "../types/tx";
import WalletSource from "../sources/LocalWalletsSource";
import {CosmosMethod, CosmosSignDocDirect} from "../types/jsonRpCosmosc";
import {useState} from "react";
import {serializeSignDoc, StdSignDoc} from "@cosmjs/amino";
import Deferred from "../types/defered";
import {AuthInfo, SignDoc} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Long from "long";
import LocalWallet from "../wallet/LocalWallet";
import {SignMode} from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {encodeSecp256k1Pubkey} from "@cosmjs/amino";
import {encodePubkey, makeAuthInfoBytes} from "@cosmjs/proto-signing";
import {toHex, fromHex} from "@cosmjs/encoding"

async function signDirectTx(signDoc: CosmosSignDocDirect, wallet: LocalWallet): Promise<SignedCosmosTx> {
    const bodyBytes = fromHex(signDoc.bodyBytes);

    const authInfoBytes = fromHex(signDoc.authInfoBytes);
    // Parse the auth info
    const authInfo = AuthInfo.decode(authInfoBytes);
    // Generate the direct pubkey
    const cosmosPubKey = encodePubkey(encodeSecp256k1Pubkey(Uint8Array.from(wallet.publicKey)));
    // Generate the auth info
    const authInfoBytesWithSigner = makeAuthInfoBytes([cosmosPubKey],
        authInfo.fee?.amount!,
        authInfo.fee?.gasLimit!.toNumber(),
        authInfo.signerInfos[0].sequence.toNumber(),
        SignMode.SIGN_MODE_DIRECT
    );

    // Create the SignDoc that will be signed
    const finalSignDoc = SignDoc.fromPartial({
        chainId: signDoc.chainId,
        accountNumber: Long.fromString(signDoc.accountNumber, 16),
        bodyBytes,
        authInfoBytes: authInfoBytesWithSigner,
    });

    // Sign the document
    const signDocBinary = SignDoc.encode(finalSignDoc).finish();
    const signature = await wallet.sign(signDocBinary);
    return {
        method: CosmosMethod.SignDirect,
        tx: {
            bodyBytes: signDoc.bodyBytes,
            chainId: signDoc.chainId,
            accountNumber: signDoc.accountNumber,
            authInfoBytes: toHex(authInfoBytesWithSigner)
        },
        signature: toHex(signature),
    }
}

async function signAminoTx(signDoc: StdSignDoc, wallet: LocalWallet): Promise<SignedCosmosTx> {
    const serialized = serializeSignDoc(signDoc);
    const signature = await wallet.sign(serialized);

    return {
        method: CosmosMethod.SignAmino,
        tx: signDoc,
        signature: toHex(signature),
    }
}

/**
 * Hook to sign a Cosmos transaction
 * Returns a stateful variable that provides the signing status and a function to initiate the signing procedure.
 */
export default function (): [Deferred<SignedCosmosTx> | null, (address: string, tx: CosmosTx, walletPassword: string) => void] {

    const [signature, setSignature] = useState<Deferred<SignedCosmosTx> | null>(null);

    const sign = async (address: string, tx: CosmosTx, walletPassword: string) => {
        try {
            setSignature(Deferred.pending());

            const wallet = await WalletSource.getWallet(address, walletPassword);
            switch (tx.method) {
                case CosmosMethod.SignAmino:
                    const signedAminoTx = await signAminoTx(tx.tx, wallet);
                    setSignature(Deferred.completed(signedAminoTx));
                    break;

                case CosmosMethod.SignDirect:
                    const signedDirectTx = await signDirectTx(tx.tx, wallet);
                    setSignature(Deferred.completed(signedDirectTx));
                    break;
            }
        } catch (e) {
            setSignature(Deferred.failed(e.toString()));
        }
    }

    return [signature, sign];
}