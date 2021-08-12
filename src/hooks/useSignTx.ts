import {CosmosTx} from "../types/tx";
import WalletSource from "../sources/LocalWalletsSource";
import {CosmosMethod} from "../types/jsonRpCosmosc";
import {useState} from "react";
import {serializeSignDoc} from "@cosmjs/amino";
import Deferred from "../types/defered";
import {SignDoc} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import Long from "long";

export default function (): [Deferred<string> | null, (address: string, tx: CosmosTx, walletPassword: string) => void] {

    const [signature, setSignature] = useState<Deferred<string> | null>(null);

    const sign = async (address: string, tx: CosmosTx, walletPassword: string) => {
        try {
            setSignature(Deferred.pending());

            const wallet = await WalletSource.getWallet(address, walletPassword);
            switch (tx.method) {
                case CosmosMethod.SignAmino:
                    const serialized = serializeSignDoc(tx.tx);
                    const aminoSignature = await wallet.sign(Buffer.from(serialized));
                    setSignature(Deferred.completed(aminoSignature.toString("base64")));
                    break;

                case CosmosMethod.SignDirect:
                    const binaryDoc = SignDoc.fromPartial({
                        chainId: tx.tx.chainId,
                        accountNumber: Long.fromString(tx.tx.accountNumber),
                        bodyBytes: Uint8Array.from(Buffer.from(tx.tx.bodyBytes, "hex")),
                        authInfoBytes: Uint8Array.from(Buffer.from(tx.tx.authInfoBytes, "hex"))
                    });
                    const binary = SignDoc.encode(binaryDoc).finish();
                    const signature = await wallet.sign(Buffer.from(binary));
                    setSignature(Deferred.completed(signature.toString("base64")));
                    break;
            }
        } catch (e) {
            setSignature(Deferred.failed(e.toString()));
        }
    }


    return [signature, sign];
}