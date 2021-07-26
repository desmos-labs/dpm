import React from 'react';
import {RootStack} from "../types/navigation";
import Accounts from "../screens/Accounts";
import NewWalletSession from "../screens/NewWalletSession";
import AccountSessions from "../screens/AccountSessions";

export default function AccountsNavigator() {
    return <RootStack.Navigator initialRouteName={"Accounts"}>
        <RootStack.Screen
            name="Accounts"
            component={Accounts}
        />
        <RootStack.Screen
            name="AccountSessions"
            options={{title: "Sessions"}}
            component={AccountSessions}/>
        <RootStack.Screen
            name="NewWalletSession"
            options={{title: "New session"}}
            component={NewWalletSession}/>
    </RootStack.Navigator>
}