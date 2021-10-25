import React from "react";
import {Text} from "react-native"
import {makeStyle} from "../../theming";

export type Props = React.ComponentProps<typeof Text>;


export const Body1: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <Text
        {...props}
        style={[styles.text, props.style]}
    >
        {props.children}
    </Text>
}

const useStyles = makeStyle(theme => ({
    text: {
        fontFamily: "SF Pro Text",
        fontSize: 16,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 22,
        letterSpacing: 0.005,
        textAlign: "left",
        color: theme.colors.text,
    }
}))