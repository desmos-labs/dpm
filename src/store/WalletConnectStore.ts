import {atom} from "recoil";
import WalletConnect from "@walletconnect/client"
import {StoreKeysEnum} from "./StoreKeysEnum";
import {SessionTypes} from "@walletconnect/types";

export type SessionRequest = {
    session: SessionTypes.Settled,
    request: SessionTypes.RequestEvent
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