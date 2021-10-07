import React from "react";
import {StyleProp, StyleSheet, Text, TextStyle} from "react-native";
import {makeStyleWithProps} from "../theming";

export type Props = React.ComponentProps<typeof Text> & {
    /**
     * If is true the fontSize will be 14 otherwise 16.
     */
    small?: boolean,
    /**
     * If true the text will be bold.
     */
    bold?: boolean,
    /**
     * If true the text will be capitalized.
     */
    capitalize?: boolean
};

export const Subtitle: React.FC<Props> = (props) => {
    const styles = useStyles(props);

    return <Text {...props}
        style={StyleSheet.compose(styles.subtitle as StyleProp<TextStyle>, props.style)}
    />
}

const useStyles = makeStyleWithProps((props: Props, _) => ({
    subtitle: {
        fontFamily: "SF Pro Text",
        fontSize: props.small ? 14 : 16,
        fontStyle: "normal",
        fontWeight: props.bold ? "bold": "400",
        textTransform: props.capitalize ? "capitalize" : "none",
        lineHeight: 20,
        letterSpacing: 0.005,
        textAlign: "left",
    },
}));