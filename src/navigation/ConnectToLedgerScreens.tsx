import React from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ConnectToLedgerScreensStack, RootStackParams} from "../types/navigation";
import {ScanForLedger} from "../screens/Ledger/ScanForLedger";
import {ConnectToLedger} from "../screens/Ledger/ConnectToLedger";

export type Props = StackScreenProps<RootStackParams, "ConnectToLedgerScreens">


export const ConnectToLedgerScreens: React.FC<Props> = ({route}) => {
    const {ledgerApp, onConnectionEstablished, onCancel, autoClose} = route.params;

    return <ConnectToLedgerScreensStack.Navigator
        initialRouteName={"ScanForLedger"}
        screenOptions={{
            headerShown: false,
        }}
    >
        <ConnectToLedgerScreensStack.Screen
            name={"ScanForLedger"}
            component={ScanForLedger}
            initialParams={{
                ledgerApp,
                onConnectionEstablished,
                onCancel,
                autoClose
            }}
        />
        <ConnectToLedgerScreensStack.Screen
            name={"ConnectToLedger"}
            component={ConnectToLedger}
        />
    </ConnectToLedgerScreensStack.Navigator>
}