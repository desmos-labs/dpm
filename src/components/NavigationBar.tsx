import {StackHeaderProps} from "@react-navigation/stack";
import React from "react";
import {Appbar, useTheme} from "react-native-paper";
import {StyleProp, ViewStyle} from "react-native";

export const NavigationBar: React.FC<StackHeaderProps> = (props) => {
    const theme = useTheme()
    const headerStyle: StyleProp<ViewStyle> = {
        backgroundColor: theme.colors.background,
        elevation: 0
    }

    return <Appbar.Header style={headerStyle}>
        {props.back ? <Appbar.BackAction
            color={theme.colors.text}
            onPress={props.navigation.goBack}
        /> : null}
        <Appbar.Content
            color={theme.colors.text}
            title={props.options.title ?? props.route.name}
        />
    </Appbar.Header>
}