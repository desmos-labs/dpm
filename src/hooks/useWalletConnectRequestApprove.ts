import {ClientTypes} from "@walletconnect/types";
import {useState} from "react";
import WalletConnect from "@walletconnect/client";
import PromiseState from "../utilils/promiseState";

export default function useWalletConnectRequestApprove(client: WalletConnect):
    [PromiseState<void> | null, (response: ClientTypes.RespondParams) => void] {
    const [status, setStatus] = useState<PromiseState<void> | null>(null);

    const approve = (response: ClientTypes.RespondParams) => {
        setStatus(PromiseState.pending());
        client.respond(response).observeState(setStatus);
    }

    return [status, approve];
}