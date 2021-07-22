import React from 'react';
import {RootStack} from "../types/navigation";
import Accounts from "../screens/Accounts";
import NewWalletSession from "../screens/NewWalletSession";

export default function AccountsNavigator() {
    return <RootStack.Navigator initialRouteName={"Accounts"}>
        <RootStack.Screen
            name="Accounts"
            component={Accounts}
        />
        <RootStack.Screen
            name="NewWalletSession"
            options={{title: "New session"}}
            component={NewWalletSession}/>
    </RootStack.Navigator>
}