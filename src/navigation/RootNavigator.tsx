import React from 'react';
import {RootStack} from "../types/navigation";
import Accounts from "../screens/Accounts";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";
import WalletConnectRequest from "../screens/WalletConnectRequest";
import SignTx from "../screens/SignTx";

export default function RootNavigator() {
    return <RootStack.Navigator initialRouteName={"Accounts"}>
        <RootStack.Screen
            name="Accounts"
            component={Accounts}
        />
        <RootStack.Screen
            name="AccountSessions"
            options={{title: "Sessions"}}
            component={AccountSessions}
        />
        <RootStack.Screen
            name="NewWalletSession"
            options={{title: "New session"}}
            component={NewWalletSession}
        />
        <RootStack.Screen
            name="WalletConnectRequest"
            component={WalletConnectRequest}
        />
        <RootStack.Screen
            name={"SignTx"}
            options={{headerShown: false}}
            component={SignTx}
        />
    </RootStack.Navigator>
}