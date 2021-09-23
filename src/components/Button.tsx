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
     * Custom text color for flat button,
     * or background color for contained button.
     */
    color?: string;
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
    labelStyle?: StyleProp<TextStyle>,
    /**
     * Whether to show a loading indicator.
     */
    loading?: boolean,
    /**
     * Whether the button is disabled.
     * A disabled button is greyed out and `onPress` is not called on touch.
     */
    disabled?: boolean,
    style?: StyleProp<ViewStyle>,
}

const Button: React.FC<Props> = props => {
    const theme = useTheme()
    const labelStyle = StyleSheet.compose(props.labelStyle, {
        color: props.mode === "contained" ? theme.colors.buttonText : props.color ?? theme.colors.primary,
        textTransform: "capitalize",
    });

    const btnStyle = StyleSheet.compose(props.style, {
        borderColor: theme.colors.primary
    });

    return <MaterialButton
        icon={props.icon}
        color={props.color ?? theme.colors.primary}
        onPress={props.onPress}
        mode={props.mode}
        labelStyle={labelStyle}
        style={btnStyle}
        loading={props.loading}
        disabled={props.disabled}
    >
        {props.children}
    </MaterialButton>;
}

export default Button;