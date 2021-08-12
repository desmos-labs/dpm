import {SessionTypes} from "@walletconnect/types";
import {useState} from "react";
import walletConnectRejectResponse from "../utilils/walletConnectRejectResponse";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import Deferred from "../types/defered";

export default function useWalletConnectRequestReject():
    [Deferred<null> | null, (request: SessionTypes.RequestEvent) => void] {

    const client = useRecoilValue(WalletConnectStore.walletConnect)!;
    const [status, setStatus] = useState<Deferred<null> | null>(null);

    const reject = async (request: SessionTypes.RequestEvent) => {
        setStatus(Deferred.pending());
        try {
            await client.respond(walletConnectRejectResponse(request));
            setStatus(Deferred.completed(null))
        } catch (e) {
            setStatus(Deferred.failed(e.toString()));
        }
    }

    return [status, reject];
}