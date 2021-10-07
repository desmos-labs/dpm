import React from "react";
import {StyleProp, StyleSheet, ViewStyle, Text, TouchableOpacity} from "react-native";
import {Subtitle} from "./Subtitle";

type InlineInputProps = {
    /**
     * Label displayed on the left of the input
     */
    label: string,
    /**
     * Value that will be displayed to the user.
     */
    value?: string
    /**
     * Function called when the user press the field.
     * This function is called only when the field is in read
     * only mode.
     */
    onPress?: () => void,
    style?: StyleProp<ViewStyle>,
}

export const InlineLabeledValue: React.FC<InlineInputProps> = (props) => {
    return <TouchableOpacity
        style={[styles.container, props.style]}
        onPress={props.onPress}
    >
        <Subtitle style={styles.label}>{props.label}</Subtitle>
        <Text style={styles.text}>{props.value}</Text>
    </TouchableOpacity>
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
    text: {
        flex: 7,
        marginStart: 2,
        paddingTop: 8,
        paddingBottom: 0,
    }
})