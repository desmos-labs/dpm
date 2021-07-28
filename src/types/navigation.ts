import {createStackNavigator} from "@react-navigation/stack";
import ChainAccount from "./chainAccount";
import {SessionRequest} from "../store/WalletConnectStore";

export type RootStackParams = {
    Accounts: undefined,
    AccountSessions: {
        account: ChainAccount
    }
    NewWalletSession: {
        account: ChainAccount
    },
    WalletConnectRequests: {
        requests: SessionRequest[]
    }
}

export const RootStack = createStackNavigator<RootStackParams>()