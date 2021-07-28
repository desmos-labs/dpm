import {ClientTypes, SessionTypes} from "@walletconnect/types";
import {useState} from "react";
import WalletConnect from "@walletconnect/client";
import PromiseState from "../utilils/promiseState";

export default function useWalletConnectRequestReject(client: WalletConnect):
    [PromiseState<void> | null, (request: SessionTypes.RequestEvent) => void] {
    const [status, setStatus] = useState<PromiseState<void> | null>(null);

    const reject = (request: SessionTypes.RequestEvent) => {
        setStatus(PromiseState.pending());
        const rejectResponse: ClientTypes.RespondParams = {
            topic: request.topic,
            response: {
                id: request.request.id,
                jsonrpc: "2.0",
                error: {
                    code: -32000,
                    message: "User rejected JSON-RPC request",
                },
            },
        };
        client.respond(rejectResponse).observeState(setStatus);
    }

    return [status, reject];
}