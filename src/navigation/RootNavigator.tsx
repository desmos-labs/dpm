import React from 'react';
import {RootStack} from "../types/navigation";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";
import WalletConnectRequest from "../screens/WalletConnectRequest";
import SignTx from "../screens/SignTx";
import {NavigationBar} from "../components";
import {useTranslation} from "react-i18next";
import Account from "../screens/Account";

export default function RootNavigator() {
    const {t} = useTranslation();

    return <RootStack.Navigator
        initialRouteName={"Account"}
        screenOptions={{
            header: NavigationBar
        }}
    >
        <RootStack.Screen
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
        <RootStack.Screen
            name="NewWalletSession"
            options={{
                title: t("new session")
            }}
            component={NewWalletSession}
        />
        <RootStack.Screen
            name="WalletConnectRequest"
            component={WalletConnectRequest}
            options={{
                headerShown: false
            }}
        />
        <RootStack.Screen
            name={"SignTx"}
            options={{
                headerShown: false
            }}
            component={SignTx}
        />
    </RootStack.Navigator>
}