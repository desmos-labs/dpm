import {createStackNavigator} from "@react-navigation/stack";
import ChainAccount from "./chainAccount";

export type RootStackParams = {
    Accounts: undefined,
    AccountSessions: {
        account: ChainAccount
    }
    NewWalletSession: {
        account: ChainAccount
    }
}

export const RootStack = createStackNavigator<RootStackParams>()