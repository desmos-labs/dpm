import {CosmosTx, SignedCosmosTx} from "../types/tx";
import {CosmosMethod, CosmosSignDocDirect} from "../types/jsonRpCosmosc";
import {useCallback} from "react";
import {serializeSignDoc, StdSignDoc} from "@cosmjs/amino";
import {AuthInfo, SignDoc, TxBody} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import LocalWallet from "../wallet/LocalWallet";
import {SignMode} from "cosmjs-types/cosmos/tx/signing/v1beta1/signing";
import {encodeSecp256k1Pubkey} from "@cosmjs/amino";
import {encodePubkey, makeAuthInfoBytes} from "@cosmjs/proto-signing";
import {toHex} from "@cosmjs/encoding"

async function signDirectTx(signDoc: CosmosSignDocDirect, wallet: LocalWallet): Promise<SignedCosmosTx> {
    // Parse the auth info
    const {authInfo} = signDoc;
    // Generate the direct pubkey
    const cosmosPubKey = encodePubkey(encodeSecp256k1Pubkey(Uint8Array.from(wallet.publicKey)));
    // Generate the auth info
    const authInfoBytesWithSigner = makeAuthInfoBytes([cosmosPubKey],
        authInfo.fee?.amount!,
        authInfo.fee?.gasLimit!.toNumber(),
        authInfo.signerInfos[0].sequence.toNumber(),
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
    const signDocBinary = SignDoc.encode(finalSignDoc).finish();
    const signature = await wallet.sign(signDocBinary);
    return {
        method: CosmosMethod.SignDirect,
        tx: {
            body: signDoc.body,
            chainId: signDoc.chainId,
            accountNumber: signDoc.accountNumber,
            authInfo: AuthInfo.decode(authInfoBytesWithSigner)
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
export default function useSignTx(): (wallet: LocalWallet, tx: CosmosTx) => Promise<SignedCosmosTx> {

    return useCallback(async (wallet: LocalWallet, tx: CosmosTx) => {
        switch (tx.method) {
            case CosmosMethod.SignAmino:
                return await signAminoTx(tx.tx, wallet);

            case CosmosMethod.SignDirect:
                return await signDirectTx(tx.tx, wallet);
        }
    } , []);
}