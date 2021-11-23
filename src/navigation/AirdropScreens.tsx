import React from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams, AirdropScreensStack} from "../types/navigation";
import {AirdropHome} from "../screens/Airdrop/AirdropHome";
import {AirdropAllocation} from "../screens/Airdrop/AirdropAllocation";
import {AirdropClaimStatus} from "../screens/Airdrop/AirdropClaimStatus";
import {AirdropClaimAction} from "../screens/Airdrop/AirdropClaimAction";
import {AirdropClaimRewards} from "../screens/Airdrop/AirdropClaimRewards";

export type Props = StackScreenProps<AccountScreensStackParams, "AirdropScreens">;

export const AirdropScreens: React.FC<Props> = () => {
    return <AirdropScreensStack.Navigator
        initialRouteName="AirdropHome"
        screenOptions={{
            headerShown: false,
        }}
    >
        <AirdropScreensStack.Screen
            name="AirdropHome"
            component={AirdropHome}
        />

        <AirdropScreensStack.Screen
            name="AirdropAllocation"
            component={AirdropAllocation}
        />

        <AirdropScreensStack.Screen
            name="AirdropClaimStatus"
            component={AirdropClaimStatus}
        />

        <AirdropScreensStack.Screen
            name="AirdropClaimAction"
            component={AirdropClaimAction}
        />

        <AirdropScreensStack.Screen
            name="AirdropClaimRewards"
            component={AirdropClaimRewards}
        />

    </AirdropScreensStack.Navigator>
}