import React, {useEffect, useRef} from "react";
import RootNavigator from "./RootNavigator";
import {DefaultTheme, NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {Theme} from "@react-navigation/native/lib/typescript/src/types";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import AccountStore from "../store/AccountStore";
import AccountCreationNavigator from "./AccountCreationNavigator";
import {RootStackParams} from "../types/navigation";

const DesmosTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F9FAFF',
    },
}

export default function Navigator() {

    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const navigatorRef = useRef<NavigationContainerRef<RootStackParams>>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);

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
        {accounts.length > 0 ? <RootNavigator/> : <AccountCreationNavigator/>}
    </NavigationContainer>;
}