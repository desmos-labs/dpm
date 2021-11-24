import React from "react";
import {ChainLinkScreensStack} from "../types/navigation";
import {ConnectChain} from "../screens/ChainLink/ConnectChain";
import {SelectChain} from "../screens/ChainLink/SelectChain";
import {LinkWithMnemonic} from "../screens/ChainLink/LinkWithMnemonic";
import {PickAddress} from "../screens/ChainLink/PickAddress";

export const ChainLinkScreens: React.FC = () => {
    return <ChainLinkScreensStack.Navigator
        initialRouteName="ConnectChain"
        screenOptions={{
            headerShown: false,
        }}
    >
        <ChainLinkScreensStack.Screen
            name="ConnectChain"
            component={ConnectChain}
        />
        <ChainLinkScreensStack.Screen
            name="SelectChain"
            component={SelectChain}
        />
        <ChainLinkScreensStack.Screen
            name="LinkWithMnemonic"
            component={LinkWithMnemonic}
        />
        <ChainLinkScreensStack.Screen
            name="PickAddress"
            component={PickAddress}
        />
    </ChainLinkScreensStack.Navigator>
}