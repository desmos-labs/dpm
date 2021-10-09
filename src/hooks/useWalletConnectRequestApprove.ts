import {ClientTypes} from "@walletconnect/types";
import {useCallback, useState} from "react";
import Deferred from "../types/defered";
import {useWalletConnectContext} from "../contexts/WalletConnectContext";

/**
 * Hook to accept the WalletConnect requests.
 * Returns a stateful variable that provides the approve status and a function to approve the request.
 */
export default function useWalletConnectRequestApprove():
    [Deferred<null> | null, (response: ClientTypes.RespondParams) => void] {
    const {client} = useWalletConnectContext();
    const [status, setStatus] = useState<Deferred<null> | null>(null);

    const approve = useCallback(async (response: ClientTypes.RespondParams) => {
        if (client !== null) {
            setStatus(Deferred.pending());
            try {
                await client.respond(response);
                setStatus(Deferred.completed(null));
            } catch (e) {
                setStatus(Deferred.failed(e.toString()));
            }
        } else {
            setStatus(Deferred.failed("client not connected"));
        }
    }, [client]);

    return [status, approve];
}