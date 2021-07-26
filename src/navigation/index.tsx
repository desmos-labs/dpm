import React from "react";
import AccountsNavigator from "./AccountsNavigator";
import {DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {Theme} from "@react-navigation/native/lib/typescript/src/types";

const DesmosTheme: Theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: '#F9FAFF',
    },
}

export default function Navigator() {

    return <NavigationContainer theme={DesmosTheme}>
        <AccountsNavigator/>
    </NavigationContainer>;
}