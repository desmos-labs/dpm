import {ClientTypes} from "@walletconnect/types";
import {useState} from "react";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import Deferred from "../types/defered";

/**
 * Hook to accept the WalletConnect requests.
 * Returns a stateful variable that provides the approve status and a function to approve the request.
 */
export default function useWalletConnectRequestApprove():
    [Deferred<null> | null, (response: ClientTypes.RespondParams) => void] {

    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [status, setStatus] = useState<Deferred<null> | null>(null);

    const approve = async (response: ClientTypes.RespondParams) => {
        setStatus(Deferred.pending());
        try {
            await client.respond(response);
            setStatus(Deferred.completed(null));
        }
        catch (e) {
            setStatus(Deferred.failed(e.toString()));
        }
    }

    return [status, approve];
}