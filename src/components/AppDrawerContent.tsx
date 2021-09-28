import React from "react";
import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {View, Text} from "react-native";

export function AppDrawerContent(props: DrawerContentComponentProps): React.ReactNode {
    return <View>
        <Text>Desmos</Text>
    </View>
}