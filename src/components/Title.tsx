import React from "react";
import {Title as MaterialTitle} from "react-native-paper"
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";

const styles = StyleSheet.create({
    title: {
        fontWeight: "700",
        fontSize: 22,
        textTransform: "capitalize",
        fontFamily: "SF-Pro-Text",
    }
})

export const Title: React.FC<React.ComponentProps<typeof Text>> = (props) => {
    return <MaterialTitle {...props}
        style={StyleSheet.compose(styles.title as StyleProp<TextStyle>, props.style)}
    >
        {props.children}
    </MaterialTitle>
}