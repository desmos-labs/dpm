import React, {useEffect, useRef} from "react";
import AccountsNavigator from "./AccountsNavigator";
import {DefaultTheme, NavigationContainer, NavigationContainerRef} from "@react-navigation/native";
import {Theme} from "@react-navigation/native/lib/typescript/src/types";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";

const DesmosTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F9FAFF',
    },
}

export default function Navigator() {

    const navigatorRef = useRef<NavigationContainerRef>(null);
    const requests = useRecoilValue(WalletConnectStore.sessionRequests);

    useEffect(() => {
        if (navigatorRef.current !== null && requests.length > 0) {
            navigatorRef.current.navigate("WalletConnectRequests");
        }
    }, [requests.length > 0])

    return <NavigationContainer theme={DesmosTheme} ref={navigatorRef}>
        <AccountsNavigator/>
    </NavigationContainer>;
}