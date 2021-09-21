import React from 'react';
import {AccountScreensStack} from "../types/navigation";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";
import WalletConnectRequest from "../screens/WalletConnectRequest";
import SignTx from "../screens/SignTx";
import {NavigationBar} from "../components";
import {useTranslation} from "react-i18next";
import Account from "../screens/Account";

export default function AccountScreens() {
    const {t} = useTranslation();

    return <AccountScreensStack.Navigator
        initialRouteName={"Account"}
        screenOptions={{
            header: NavigationBar
        }}
    >
        <AccountScreensStack.Screen
            name="Account"
            component={Account}
            options={{
                headerShown: false,
            }}
        />
        <RootStack.Screen
            name="AccountSessions"
            options={{
                title: t("sessions")
            }}
            component={AccountSessions}
        />
        <AccountScreensStack.Screen
            name="NewWalletSession"
            options={{
                title: t("new session")
            }}
            component={NewWalletSession}
        />
        <AccountScreensStack.Screen
            name="WalletConnectRequest"
            component={WalletConnectRequest}
            options={{
                headerShown: false
            }}
        />
        <AccountScreensStack.Screen
            name="SignTx"
            options={{
                headerShown: false
            }}
            component={SignTx}
        />
    </RootStack.Navigator>
}