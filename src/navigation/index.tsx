import React, {useEffect, useRef} from "react";
import AccountScreens from "./AccountScreens";
import {DefaultTheme, NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {Theme} from "@react-navigation/native/lib/typescript/src/types";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import AccountStore from "../store/AccountStore";
import AccountCreationScreens from "./AccountCreationScreens";
import {AccountScreensStackParams, RootStack} from "../types/navigation";
import SelectAccount from "../screens/Accounts";

const DesmosTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F9FAFF',
    },
}

export default function Navigator() {

    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const navigatorRef = useRef<NavigationContainerRef<AccountScreensStackParams>>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);
    const selectedAccount = useRecoilValue(AccountStore.selectedAccount);

    useEffect(() => {
        if (navigatorRef.current !== null && requests.length > 0) {
            navigatorRef.current.navigate({
                name: "WalletConnectRequest",
                params: {
                    session: requests[0].session,
                    request: requests[0].request,
                },
                key: requests[0].request.request.id.toString()
            });
        }
    }, [requests])

    return <NavigationContainer theme={DesmosTheme} ref={navigatorRef}>
        <RootStack.Navigator
            screenOptions={{
                animationEnabled: false,
                headerShown: false,
            }}
        >
            {accounts.length === 0 ? (
                <RootStack.Screen name="AccountCreationScreens" component={AccountCreationScreens}/>
            ) : selectedAccount !== null ? (
                <RootStack.Screen name="AccountScreens" component={AccountScreens}/>
            ) : (
                <RootStack.Screen name="SelectAccount" component={SelectAccount}/>
            )}
        </RootStack.Navigator>
    </NavigationContainer>;
}