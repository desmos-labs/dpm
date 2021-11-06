import {useDesmosClient} from "@desmoslabs/sdk-react";
import {useCallback} from "react";
import {EncodeObject, OfflineSigner} from "@cosmjs/proto-signing";
import {StdFee} from "@cosmjs/amino";
import {isBroadcastTxFailure} from "@desmoslabs/sdk-core";


/**
 * Hook that returns a function that create a transaction with the provided
 * messages and sign that with the provided signer.
 * If the transactions fails will be raised an Error.
 */
export default function useBroadcastMessages() {
    const client = useDesmosClient();

    return useCallback(async (signer: OfflineSigner, messages: EncodeObject[],
        fee: StdFee, memo?: string
    ) => {
        client.setSigner(signer);
        await client.connect();
        const signerAddress = await signer.getAccounts();
        const broadcastResult = await client.signAndBroadcast(signerAddress[0].address, messages, fee, memo);
        if (isBroadcastTxFailure(broadcastResult)) {
            throw new Error(broadcastResult.rawLog ?? "Unknown error");
        }
    }, [client]);
}