import React from "react";
import {StyleProp, TextStyle, TextInput as NativeTextInput, View, ViewStyle} from "react-native";
import {makeStyleWithProps} from "../theming";

export type Props = Omit<React.ComponentProps<typeof NativeTextInput>, "style"> & {
    rightElement?: React.ReactNode | null,

    style?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>,
};

export const TextInput: React.FC<Props> = (props) => {
    const styles = useStyles(props);

    return <View style={[styles.container, props.style]}>
        <NativeTextInput
            {...props}
            style={[styles.input, props.inputStyle]}
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
        borderRadius: 6,
        minHeight: 44,
        alignItems: "center"
    },
    input: {
        fontFamily: "SF Pro Text",
        paddingHorizontal: 11,
        flexGrow: 1,
        textAlignVertical: props.multiline === true ? "top" : "center",
    },
    right: {
        padding: 0,
        margin: 0,
        paddingRight: 11,
    }
}));