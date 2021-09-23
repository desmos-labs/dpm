import React from "react";
import {StyleProp, StyleSheet, TextStyle, TextInput as NativeTextInput} from "react-native";
import {makeStyle} from "../theming";

export type Props = React.ComponentProps<typeof NativeTextInput>;

export const TextInput: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <NativeTextInput
        {...props}
        style={StyleSheet.compose(styles.input as StyleProp<TextStyle>, props.style)}
    />
}

const useStyles = makeStyle(theme => ({
    input: {
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
        fontFamily: "SF-Pro-Text",
        padding: theme.spacing.s,
    }
}));