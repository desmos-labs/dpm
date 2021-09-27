import React from "react";
import {StyleProp, StyleSheet, TextStyle, TextInput as NativeTextInput, View, ViewStyle} from "react-native";
import {makeStyle} from "../theming";

export type Props = Omit<React.ComponentProps<typeof NativeTextInput>, "style"> & {
    rightElement?: React.ReactNode | null,

    style?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
};

export const TextInput: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <View style={StyleSheet.compose(styles.container as StyleProp<ViewStyle>, props.style)}>
        <NativeTextInput
            {...props}
            style={StyleSheet.compose(styles.input as StyleProp<TextStyle>, props.inputStyle)}
        />
        <View style={styles.right}>
            {props.rightElement}
        </View>
    </View>
}

const useStyles = makeStyle(theme => ({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        borderRadius: 6,
        minHeight: 44,
    },
    input: {
        fontFamily: "SF-Pro-Text",
        paddingHorizontal: 11,
        flexGrow: 1,
        textAlignVertical: "top",
    },
    right: {
        padding: 0,
        margin: 0,
        paddingRight: 11,
    }
}));