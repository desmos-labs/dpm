import React from "react";
import {BottomTabScreenProps} from "@react-navigation/bottom-tabs";
import {AccountScreensStackParams, AppDrawerParams, HomeScreenBottomTabsParams} from "../types/navigation";
import {Text} from "react-native";
import {StyledSafeAreaView} from "../components";
import {CompositeScreenProps} from "@react-navigation/native";
import {DrawerScreenProps} from "@react-navigation/drawer";
import {StackScreenProps} from "@react-navigation/stack";

export type Props = CompositeScreenProps<
    BottomTabScreenProps<HomeScreenBottomTabsParams, "ScanQr">,
    CompositeScreenProps<
        DrawerScreenProps<AppDrawerParams>, StackScreenProps<AccountScreensStackParams>>
    >;

export const ScanQr: React.FC<Props> = (_) => {
    return <StyledSafeAreaView>
        <Text>ScanQr</Text>
    </StyledSafeAreaView>
}