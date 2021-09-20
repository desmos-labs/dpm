import React from "react";
import {Button as MaterialButton, useTheme} from "react-native-paper"
import {StyleProp, StyleSheet, TextStyle, ViewStyle} from "react-native";
import {IconSource} from "react-native-paper/lib/typescript/components/Icon";

export type Props = {
    /**
     * Mode of the button. You can change the mode to adjust the styling to give it desired emphasis.
     * - `text` - flat button without background or outline (low emphasis)
     * - `outlined` - button with an outline (medium emphasis)
     * - `contained` - button with a background color and elevation shadow (high emphasis)
     */
    mode?: 'text' | 'outlined' | 'contained';
    /**
     * Icon to display for the `Button`.
     */
    icon?: IconSource
    /**
     * Function to execute on press.
     */
    onPress?: () => void,
    /**
     * Style for the button text.
     */
    labelStyle?: StyleProp<TextStyle>
    style?: StyleProp<ViewStyle>,
}

const Button: React.FC<Props> = props => {
    const theme = useTheme()
    const labelStyle = StyleSheet.compose(props.labelStyle, {
        color: props.mode === "contained" ? theme.colors.buttonText : theme.colors.primary
    });

    const btnStyle = StyleSheet.compose(props.style, {
        borderColor: theme.colors.primary
    });

    return <MaterialButton
        icon={props.icon}
        onPress={props.onPress}
        mode={props.mode}
        labelStyle={labelStyle}
        style={btnStyle}
    >
        {props.children}
    </MaterialButton>;
}

export default Button;