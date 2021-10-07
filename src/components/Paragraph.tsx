import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {makeStyleWithProps} from "../theming";

export type Props = React.ComponentProps<typeof Text> & {
    /**
     * Text font size.
     */
    fontSize?: 14 | 16,
    /**
     * True to force the text to be capitalized.
     */
    capitalize?: boolean,
};

export const Paragraph: React.FC<Props> = (props) => {
    const styles = useStyles(props);

    return <Text {...props}
        style={StyleSheet.compose(styles.paragraph as StyleProp<TextStyle>, props.style)}
    />
}

const useStyles = makeStyleWithProps((props: Props, theme) => ({
    paragraph: {
        fontFamily: "SF Pro Text",
        fontSize: props.fontSize ?? 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
        color: theme.colors.text,
        textTransform: props.capitalize ? "capitalize" : "none",
    }
}));