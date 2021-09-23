import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {makeStyle} from "../theming";

export type Props = React.ComponentProps<typeof Text> & {
    small?: boolean
    bold?: boolean
};

export const Subtitle: React.FC<Props> = (props) => {
    const styles = useStyles();

    let subtitleStyle: StyleProp<TextStyle> = styles.subtitle;
    if (props.small) {
        subtitleStyle = StyleSheet.compose(subtitleStyle, styles.small);
    }
    if (props.bold) {
        subtitleStyle = StyleSheet.compose(subtitleStyle, styles.bold);
    }

    return <Text {...props}
        style={StyleSheet.compose(subtitleStyle as StyleProp<TextStyle>, props.style)}
    />
}

const useStyles = makeStyle(_ => ({
    subtitle: {
        fontFamily: "SF-Pro-Text",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
    },
    small: {
        fontSize: 14,
    },
    bold: {
        fontWeight: "500",
    }
}));