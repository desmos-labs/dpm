import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {makeStyle} from "../theming";

export type Props = React.ComponentProps<typeof Text> & {
    fontSize?: 14 | 16
};

export const Paragraph: React.FC<Props> = (props) => {
    const styles = useStyles();

    let style: StyleProp<TextStyle> = styles.paragraph;
    if (props.fontSize) {
        style = StyleSheet.compose(style, {fontSize: props.fontSize})
    }

    return <Text {...props}
        style={StyleSheet.compose(style, props.style)}
    />
}

const useStyles = makeStyle(theme => ({
    paragraph: {
        fontFamily: "SF-Pro-Text",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
        color: theme.colors.text,
    }
}));