import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {makeStyle} from "../theming";

export type Props = React.ComponentProps<typeof Text>;

export const Paragraph: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <Text {...props}
        style={StyleSheet.compose(styles.paragraph as StyleProp<TextStyle>, props.style)}
    />
}

const useStyles = makeStyle(_ => ({
    paragraph: {
        fontFamily: "SF-Pro-Text",
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
    }
}));