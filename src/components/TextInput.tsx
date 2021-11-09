import React from "react";
import {StyleProp, TextStyle, TextInput as NativeTextInput, View, ViewStyle} from "react-native";
import {makeStyleWithProps} from "../theming";
import {useTheme} from "react-native-paper";

export type Props = Omit<React.ComponentProps<typeof NativeTextInput>, "style"> & {
    /**
     * If true highlight the input field to
     * signal to the user that the current value
     * is not valid.
     */
    error?: boolean,
    /**
     * Element to show on the right side of the
     * input area.
     */
    rightElement?: React.ReactNode | null,

    style?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
};

export const TextInput: React.FC<Props> = (props) => {
    const styles = useStyles(props);
    const theme = useTheme()

    return <View style={[styles.container, props.style]}>
        <NativeTextInput
            {...props}
            style={[styles.input, props.inputStyle]}
            placeholderTextColor={theme.colors.font["3"]}
        />
        <View style={styles.right}>
            {props.rightElement}
        </View>
    </View>
}

const useStyles = makeStyleWithProps((props: Props, theme) => ({
    container: {
        display: "flex",
        flexDirection: "row",
        backgroundColor: theme.colors.surface,
        borderRadius: theme.roundness,
        minHeight: 44,
        alignItems: "center",
        borderColor: props.error ? theme.colors.error : theme.colors.surface,
        borderWidth: 2
    },
    input: {
        fontFamily: "Poppins-Regular",
        paddingHorizontal: 11,
        flexGrow: 1,
        textAlignVertical: props.multiline === true ? "top" : "center",
        height: "100%",
        color: theme.colors.font["1"],
        minHeight: props.numberOfLines !== undefined ? 25 * props.numberOfLines : undefined,
    },
    right: {
        padding: 0,
        margin: 0,
        paddingRight: 11,
    }
}));