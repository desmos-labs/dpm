import React from 'react';
import {AccountCreationStack} from "../types/navigation";
import AccountCreation from "../screens/AccountCreation/AccountCreation";
import GenerateNewMnemonic from "../screens/AccountCreation/GenerateNewMnemonic";
import CheckMnemonic from "../screens/AccountCreation/CheckMnemonic";
import ImportAccount from "../screens/AccountCreation/ImportAccount";
import GenerateAccountKeys from "../screens/AccountCreation/GenerateAccountKeys";
import CreateWalletPassword from "../screens/AccountCreation/CreateWalletPassword";
import {useTranslation} from "react-i18next";
import {NavigationBar} from "../components";
import {PickDerivationPath} from "../screens/AccountCreation/PickDerivationPath";

export default function AccountCreationScreens() {
    const {t} = useTranslation();

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
            options={{
                title: t("create wallet password"),
            }}
            component={CreateWalletPassword}
        />
        <AccountCreationStack.Screen
            name={"GenerateAccountKeys"}
            options={{
                headerShown: false
            }}
            component={GenerateAccountKeys}
        />
    </AccountCreationStack.Navigator>
}