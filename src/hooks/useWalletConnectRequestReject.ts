import {SessionTypes} from "@walletconnect/types";
import {useState} from "react";
import WalletConnect from "@walletconnect/client";
import PromiseState from "../utilils/promiseState";
import walletConnectRejectResponse from "../utilils/walletConnectRejectResponse";

export default function useWalletConnectRequestReject(client: WalletConnect):
    [PromiseState<void> | null, (request: SessionTypes.RequestEvent) => void] {
    const [status, setStatus] = useState<PromiseState<void> | null>(null);

    const reject = (request: SessionTypes.RequestEvent) => {
        setStatus(PromiseState.pending());
        client.respond(walletConnectRejectResponse(request)).observeState(setStatus);
    }

    return [status, reject];
}