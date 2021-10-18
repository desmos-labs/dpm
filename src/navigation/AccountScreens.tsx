import React from 'react';
import {
    AccountScreensStack,
    RootStackParams
} from "../types/navigation";
import AuthorizeSession from "../screens/AuthorizeSession";
import SignTx from "../screens/SignTx";
import {useTranslation} from "react-i18next";
import {EditProfile} from "../screens/EditProfile";
import {UnlockWallet} from "../screens/UnlockWallet";
import {BroadcastTx} from "../screens/BroadcastTx";
import {StackScreenProps} from "@react-navigation/stack";
import {ConfirmProfileEdit} from "../screens/ConfirmProfileEdit";
import {BiographyEditor} from "../screens/BiographyEditor";
import {WalletConnectCallRequest} from "../screens/WalletConnectCallRequest";
import useHandleCallRequests from "../hooks/useHandleCallRequests";
import {HomeScreens} from './HomeScreens';
import Profile from "../screens/Profile";

type AccountScreensProps = StackScreenProps<RootStackParams, "AccountScreens">

export default function AccountScreens(_: AccountScreensProps) {
    const {t} = useTranslation();

    useHandleCallRequests();

    return <AccountScreensStack.Navigator
        initialRouteName="HomeScreens"
        screenOptions={{
            headerShown: false,
        }}
    >
        <AccountScreensStack.Screen
            name="HomeScreens"
            component={HomeScreens}
        />
        <AccountScreensStack.Screen
            name="Profile"
            component={Profile}
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
            name="AuthorizeSession"
            options={{
                title: t("new session")
            }}
            component={AuthorizeSession}
        />
        <AccountScreensStack.Screen
            name="SignTx"
            component={SignTx}
        />
        <AccountScreensStack.Screen
            name="BroadcastTx"
            component={BroadcastTx}
        />
        <AccountScreensStack.Screen
            name="UnlockWallet"
            options={{
                presentation: 'transparentModal',
            }}
            component={UnlockWallet}
        />
        <AccountScreensStack.Screen
            name="WalletConnectCallRequest"
            component={WalletConnectCallRequest}
        />
    </AccountScreensStack.Navigator>
}