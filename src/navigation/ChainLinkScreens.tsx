import React from "react";
import {ChainLinkScreensStack} from "../types/navigation";
import {ConnectChain} from "../screens/ChainLink/ConnectChain";
import {SelectChain} from "../screens/ChainLink/SelectChain";
import {LinkWithMnemonic} from "../screens/ChainLink/LinkWithMnemonic";
import {PickAddress} from "../screens/ChainLink/PickAddress";
import {SelectLedgerApp} from "../screens/ChainLink/SelectLedgerApp";
import {ScanForLedger} from "../screens/ChainLink/ScanForLedger";
import {ConnectToLeger} from "../screens/ChainLink/ConnectToLedger";

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
            name="SelectLedgerApp"
            component={SelectLedgerApp}
        />
        <ChainLinkScreensStack.Screen
            name="LinkWithMnemonic"
            component={LinkWithMnemonic}
        />
        <ChainLinkScreensStack.Screen
            name="ScanForLedger"
            component={ScanForLedger}
        />
        <ChainLinkScreensStack.Screen
            name="ConnectToLedger"
            component={ConnectToLeger}
        />
        <ChainLinkScreensStack.Screen
            name="PickAddress"
            component={PickAddress}
        />
    </ChainLinkScreensStack.Navigator>
}