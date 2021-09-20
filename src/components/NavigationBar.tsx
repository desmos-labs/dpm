import {StackHeaderProps} from "@react-navigation/stack";
import React from "react";
import {Appbar, useTheme} from "react-native-paper";

export const NavigationBar: React.FC<StackHeaderProps> = (props) => {
    const theme = useTheme()

    return <Appbar.Header>
        {props.back ? <Appbar.BackAction
            color={theme.colors.appBarContent}
            onPress={props.navigation.goBack}
        /> : null}
        <Appbar.Content
            color={theme.colors.appBarContent}
            title={props.options.title ?? props.route.name}
        />
    </Appbar.Header>
}