import {SessionTypes} from "@walletconnect/types";
import {useCallback, useState} from "react";
import walletConnectRejectResponse from "../utilils/walletConnectRejectResponse";
import Deferred from "../types/defered";
import {useWalletConnectContext} from "../contexts/WalletConnectContext";

/**
 * Hook to reject the WalletConnect requests.
 * Returns a stateful variable that provides the reject status and a function to reject the request.
 */
export default function useWalletConnectRequestReject():
    [Deferred<null> | null, (request: SessionTypes.RequestEvent) => void] {

    const {client} = useWalletConnectContext();
    const [status, setStatus] = useState<Deferred<null> | null>(null);

    const reject = useCallback(async (request: SessionTypes.RequestEvent) => {
        if (client !== null) {
            setStatus(Deferred.pending());
            try {
                await client.respond(walletConnectRejectResponse(request));
                setStatus(Deferred.completed(null))
            } catch (e) {
                setStatus(Deferred.failed(e.toString()));
            }
        } else {
            setStatus(Deferred.failed("client not connected"));
        }
    }, [client]);

    return [status, reject];
}