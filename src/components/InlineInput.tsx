import React, {ComponentProps} from "react";
import {StyleProp, StyleSheet, TextInput, TextStyle, View, ViewStyle} from "react-native";
import {Subtitle} from "./Subtitle";

type InlineInputProps = Omit<ComponentProps<typeof TextInput>, "style"> & {
    label: string
    style?: StyleProp<ViewStyle>,
    inputStyle?: StyleProp<TextStyle>
}

export const InlineInput: React.FC<InlineInputProps> = (props) => {
    return <View style={[styles.container, props.style]}>
        <Subtitle style={styles.label}>{props.label}</Subtitle>
        <TextInput
            {...props}
            style={[styles.input, props.inputStyle]}
            textAlignVertical="top"
        />
    </View>
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        paddingVertical: 4,
    },
    label: {
        flex: 2,
        paddingTop: 8,

    },
    input: {
        flex: 7,
        paddingTop: 8,
        paddingBottom: 0,
    }
})