import {createStackNavigator} from "@react-navigation/stack";
import ChainAccount from "./chainAccount";

export type RootStackParams = {
    Accounts: undefined,
    NewWalletSession: {
        account: ChainAccount
    }
}

export const RootStack = createStackNavigator<RootStackParams>()