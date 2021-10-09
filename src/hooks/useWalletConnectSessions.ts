import {SessionTypes} from "@walletconnect/types";
import {useWalletConnectContext} from "../contexts/WalletConnectContext";

export default function useWalletConnectSessions(): SessionTypes.Settled[] {
    const {sessions} = useWalletConnectContext();
    return sessions;
}