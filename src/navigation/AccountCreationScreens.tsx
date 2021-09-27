import React from 'react';
import {AccountCreationStack} from "../types/navigation";
import AccountCreation from "../screens/AccountCreation/AccountCreation";
import GenerateNewMnemonic from "../screens/AccountCreation/GenerateNewMnemonic";
import CheckMnemonic from "../screens/AccountCreation/CheckMnemonic";
import ImportAccount from "../screens/AccountCreation/ImportAccount";
import GenerateAccount from "../screens/AccountCreation/GenerateAccount";
import WalletPassword from "../screens/AccountCreation/WalletPassword";
import {NavigationBar} from "../components";
import {PickDerivationPath} from "../screens/AccountCreation/PickDerivationPath";

export default function AccountCreationScreens() {
    return <AccountCreationStack.Navigator
        initialRouteName={"AccountCreation"}
        screenOptions={{
            title: "",
            header: NavigationBar
        }}
    >
        <AccountCreationStack.Screen
            name="AccountCreation"
            component={AccountCreation}
            options={{
                headerShown: false,
            }}
        />
        <AccountCreationStack.Screen
            name="GenerateNewMnemonic"
            component={GenerateNewMnemonic}
        />
        <AccountCreationStack.Screen
            name="CheckMnemonic"
            component={CheckMnemonic}
        />
        <AccountCreationStack.Screen
            name="PickDerivationPath"
            component={PickDerivationPath}
        />
        <AccountCreationStack.Screen
            name={"ImportAccount"}
            component={ImportAccount}
        />
        <AccountCreationStack.Screen
            name="CreateWalletPassword"
            component={WalletPassword}
        />
        <AccountCreationStack.Screen
            name="CheckWalletPassword"
            component={WalletPassword}
        />
        <AccountCreationStack.Screen
            name={"GenerateAccount"}
            options={{
                headerShown: false
            }}
            component={GenerateAccount}
        />
    </AccountCreationStack.Navigator>
}