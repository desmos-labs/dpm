import React from 'react';
import {AccountScreensStack, AppDrawer} from "../types/navigation";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";
import WalletConnectRequest from "../screens/WalletConnectRequest";
import SignTx from "../screens/SignTx";
import {NavigationBar} from "../components";
import {useTranslation} from "react-i18next";
import Account from "../screens/Account";
import {EditProfile} from "../screens/EditProfile";
import {UnlockWallet} from "../screens/UnlockWallet";
import {BroadcastTx} from "../screens/BroadcastTx";
import {AppDrawerContent} from "../components/AppDrawerContent";

function AccountWithAppDrawer() {
    return <AppDrawer.Navigator
        screenOptions={{
            headerShown: false,
        }}
        drawerContent={AppDrawerContent}
    >
        <AppDrawer.Screen name="AccountScreen" component={Account} />
    </AppDrawer.Navigator>
}

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
            component={AccountWithAppDrawer}
            options={{
                headerShown: false,
            }}
        />
        <AccountScreensStack.Screen
            name="EditProfile"
            component={EditProfile}
            options={{
                headerShown: true,
                title: t("edit profile")
            }}
        />
        <AccountScreensStack.Screen
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
        <AccountScreensStack.Screen
            name="BroadcastTx"
            options={{
                headerShown: false,
                presentation: 'transparentModal',
            }}
            component={BroadcastTx}
        />
        <AccountScreensStack.Screen
            name="UnlockWallet"
            options={{
                headerShown: false,
                presentation: 'transparentModal',
            }}
            component={UnlockWallet}
        />
    </AccountScreensStack.Navigator>
}