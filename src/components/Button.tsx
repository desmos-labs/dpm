import React from "react";
import {Button as MaterialButton, useTheme} from "react-native-paper"
import {StyleProp, TextStyle, ViewStyle} from "react-native";
import {IconSource} from "react-native-paper/lib/typescript/components/Icon";
import {makeStyleWithProps} from "../theming";

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
    /**
     * If tru display the button with the accent color from the current1 theme.
     */
    accent?: boolean,
    style?: StyleProp<ViewStyle>,
}

export const Button: React.FC<Props> = props => {
    const theme = useTheme()
    const styles = useStyles(props);

    return <MaterialButton
        icon={props.icon}
        color={props.color ?? props.accent ? theme.colors.accent : theme.colors.primary}
        onPress={props.onPress}
        mode={props.mode}
        labelStyle={[styles.labelStyle, props.labelStyle]}
        style={[styles.btnStyle, props.style]}
        contentStyle={styles.contentStyle}
        loading={props.loading}
        disabled={props.disabled}
    >
        {props.children}
    </MaterialButton>;
}

const useStyles = makeStyleWithProps((props: Props, theme) => {
    const color = props.color ? props.color :
        props.accent ? theme.colors.accent : theme.colors.primary;

    return {
        labelStyle: {
            color: props.mode === "contained" ? theme.colors.font["5"] : color,
            textTransform: "capitalize",
        },
        btnStyle: {
            borderColor: color,
            borderWidth: props.mode === "outlined" ? 1 : 0,
            elevation: 0,
        },
        contentStyle: {
            height: 42,
        }
    }
})