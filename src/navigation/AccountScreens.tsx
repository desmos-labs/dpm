import React from 'react';
import {
    AccountScreensStack,
    AccountScreensStackParams,
    AppDrawer,
    RootStackParams
} from "../types/navigation";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";
import WalletConnectRequest from "../screens/WalletConnectRequest";
import SignTx from "../screens/SignTx";
import {useTranslation} from "react-i18next";
import Profile from "../screens/Profile";
import {EditProfile} from "../screens/EditProfile";
import {UnlockWallet} from "../screens/UnlockWallet";
import {BroadcastTx} from "../screens/BroadcastTx";
import {AppDrawerContent} from "../components/AppDrawerContent";
import {StackScreenProps} from "@react-navigation/stack";
import {ConfirmProfileEdit} from "../screens/ConfirmProfileEdit";
import {BiographyEditor} from "../screens/BiographyEditor";

type ProfileWithAppDrawerProps = StackScreenProps<AccountScreensStackParams, "ProfileWithDrawerMenu">

function ProfileWithDrawerMenu(_: ProfileWithAppDrawerProps) {
    return <AppDrawer.Navigator
        screenOptions={{
            headerShown: false,
        }}
        drawerContent={props => <AppDrawerContent {...props} />}
    >
        <AppDrawer.Screen
            name="Profile"
            component={Profile}
        />
    </AppDrawer.Navigator>
}

type AccountScreensProps = StackScreenProps<RootStackParams, "AccountScreens">

export default function AccountScreens(_: AccountScreensProps) {
    const {t} = useTranslation();

    return <AccountScreensStack.Navigator
        initialRouteName={"ProfileWithDrawerMenu"}
        screenOptions={{
            headerShown: false,
        }}
    >
        <AccountScreensStack.Screen
            name="ProfileWithDrawerMenu"
            component={ProfileWithDrawerMenu}
        />
        <AccountScreensStack.Screen
            name="EditProfile"
            component={EditProfile}
        />
        <AccountScreensStack.Screen
            name="BiographyEditor"
            component={BiographyEditor}
        />
        <AccountScreensStack.Screen
            name="ConfirmProfileEdit"
            component={ConfirmProfileEdit}
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