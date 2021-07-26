import {atom} from "recoil";
import WalletConnect from "@walletconnect/client"
import {StoreKeysEnum} from "./StoreKeysEnum";
import {SessionTypes} from "@walletconnect/types";

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

export default {
    walletConnect,
    settledSessions
}