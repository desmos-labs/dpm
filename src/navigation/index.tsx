import React from "react";
import AccountsNavigator from "./AccountsNavigator";
import {NavigationContainer} from "@react-navigation/native";

export default function Navigator() {
    return <NavigationContainer>
        <AccountsNavigator/>
    </NavigationContainer>;
}