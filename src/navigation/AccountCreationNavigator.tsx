import React from 'react';
import {AccountCreationStack} from "../types/navigation";
import AccountCreation from "../screens/AccountCreation/AccountCreation";
import GenerateNewMnemonic from "../screens/AccountCreation/GenerateNewMnemonic";
import CheckMnemonic from "../screens/AccountCreation/CheckMnemonic";
import ImportAccount from "../screens/AccountCreation/ImportAccount";
import GenerateAccountKeys from "../screens/AccountCreation/GenerateAccountKeys";
import CreateWalletPassword from "../screens/AccountCreation/CreateWalletPassword";

export default function AccountCreationNavigator() {
    return <AccountCreationStack.Navigator initialRouteName={"AccountCreation"}>
        <AccountCreationStack.Screen
            name="AccountCreation"
            component={AccountCreation}
        />
        <AccountCreationStack.Screen
            name="GenerateNewMnemonic"
            options={{title: "New account"}}
            component={GenerateNewMnemonic}
        />
        <AccountCreationStack.Screen
            name="CheckMnemonic"
            options={{headerShown: false}}
            component={CheckMnemonic}
        />
        <AccountCreationStack.Screen
            name={"ImportAccount"}
            options={{headerShown: false}}
            component={ImportAccount}
        />
        <AccountCreationStack.Screen
            name="CreateWalletPassword"
            options={{headerShown: false}}
            component={CreateWalletPassword}
        />
        <AccountCreationStack.Screen
            name={"GenerateAccountKeys"}
            options={{headerShown: false}}
            component={GenerateAccountKeys}
        />
    </AccountCreationStack.Navigator>
}