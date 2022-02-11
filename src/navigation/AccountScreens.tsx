import React from 'react';
import {
    AccountScreensStack,
    RootStackParams
} from "../types/navigation";
import AuthorizeSession from "../screens/AuthorizeSession";
import {useTranslation} from "react-i18next";
import {EditProfile} from "../screens/EditProfile";
import {AuthorizeOperation} from "../screens/AuthorizeOperation";
import {StackScreenProps} from "@react-navigation/stack";
import {ConfirmProfileEdit} from "../screens/ConfirmProfileEdit";
import {BiographyEditor} from "../screens/BiographyEditor";
import {WalletConnectCallRequest} from "../screens/WalletConnectCallRequest";
import useHandleCallRequests from "../hooks/useHandleCallRequests";
import {HomeScreens} from './HomeScreens';
import Profile from "../screens/Profile";
import {SendToken} from "../screens/SendToken";
import {ConfirmTx} from "../screens/ConfirmTx";
import {TxDetails} from "../screens/TxDetails";
import {ChainLinkScreens} from "./ChainLinkScreens";
import {ChainLinkDetails} from "../screens/ChainLinkDetails";
import {AirdropScreens} from "./AirdropScreens";

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
            name="SendToken"
            component={SendToken}
        />
        <AccountScreensStack.Screen
            name="ConfirmTx"
            component={ConfirmTx}
        />
        <AccountScreensStack.Screen
            name="TxDetails"
            component={TxDetails}
        />
        <AccountScreensStack.Screen
            name="AuthorizeOperation"
            options={{
                presentation: 'transparentModal',
            }}
            component={AuthorizeOperation}
        />
        <AccountScreensStack.Screen
            name="ChainLinkScreens"
            component={ChainLinkScreens}
        />
        <AccountScreensStack.Screen
            name="WalletConnectCallRequest"
            component={WalletConnectCallRequest}
        />
        <AccountScreensStack.Screen
            name="ChainLinkDetails"
            component={ChainLinkDetails}
            options={{
                presentation: "transparentModal"
            }}
        />
        <AccountScreensStack.Screen
            name="AirdropScreens"
            component={AirdropScreens}
        />
    </AccountScreensStack.Navigator>
}