import {atom} from "recoil";
import WalletConnect from "@walletconnect/client"
import {StoreKeysEnum} from "./StoreKeysEnum";
import {SessionTypes} from "@walletconnect/types";
import {RpcRequest} from "../types/jsonRpc";

export interface WalletConnectRequestEvent extends SessionTypes.RequestEvent {
    request: RpcRequest
}

export type SessionRequest = {
    session: SessionTypes.Settled,
    request: WalletConnectRequestEvent
}

const walletConnect = atom<WalletConnect | undefined>(
    {
        key: StoreKeysEnum.walletConnect,
        dangerouslyAllowMutability: true,
        default: undefined
    }
);

const settledSessions = atom<SessionTypes.Settled[]>(
    {
        key: StoreKeysEnum.walletConnectSettledSessions,
        default: []
    }
);

const sessionRequests = atom<SessionRequest[]>(
    {
        key: StoreKeysEnum.walletConnectSessionRequests,
        default: []
    }
);

export default {
    walletConnect,
    settledSessions,
    sessionRequests,
}