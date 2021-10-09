import {SessionTypes} from "@walletconnect/types";
import {RpcRequest} from "./jsonRpc";

export interface WalletConnectRequestEvent extends SessionTypes.RequestEvent {
    request: RpcRequest;
}

export type SessionRequest = {
    session: SessionTypes.Settled;
    request: WalletConnectRequestEvent;
};
