import React from 'react';
import {
    AccountScreensStack,
    AccountScreensStackParams,
    AppDrawer,
    RootStackParams
} from "../types/navigation";
import AuthorizeSession from "../screens/AuthorizeSession";
import SignTx from "../screens/SignTx";
import {useTranslation} from "react-i18next";
import {EditProfile} from "../screens/EditProfile";
import {UnlockWallet} from "../screens/UnlockWallet";
import {BroadcastTx} from "../screens/BroadcastTx";
import {AppDrawerContent} from "../components/AppDrawerContent";
import {StackScreenProps} from "@react-navigation/stack";
import {ConfirmProfileEdit} from "../screens/ConfirmProfileEdit";
import {BiographyEditor} from "../screens/BiographyEditor";
import {HomeScreens} from "./HomeScreens";
import {WalletConnectCallRequest} from "../screens/WalletConnectCallRequest";
import useHandleCallRequests from "../hooks/useHandleCallRequests";

type ProfileWithAppDrawerProps = StackScreenProps<AccountScreensStackParams, "ProfileWithDrawerMenu">

function ProfileWithDrawerMenu(_: ProfileWithAppDrawerProps) {
    return <AppDrawer.Navigator
        screenOptions={{
            headerShown: false,
        }}
        drawerContent={props => <AppDrawerContent {...props} />}
    >
        <AppDrawer.Screen
            name="HomeScreen"
            component={HomeScreens}
        />
    </AppDrawer.Navigator>
}

type AccountScreensProps = StackScreenProps<RootStackParams, "AccountScreens">

export default function AccountScreens(_: AccountScreensProps) {
    const {t} = useTranslation();

    useHandleCallRequests();

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
            name="AuthorizeSession"
            options={{
                title: t("new session")
            }}
            component={AuthorizeSession}
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
        <AccountScreensStack.Screen
            name="WalletConnectCallRequest"
            component={WalletConnectCallRequest}
        />
    </AccountScreensStack.Navigator>
}