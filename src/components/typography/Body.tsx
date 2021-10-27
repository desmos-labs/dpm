import React from "react";
import {Text} from "react-native"
import {makeStyle} from "../../theming";

export type Props = React.ComponentProps<typeof Text>;


export const Body: React.FC<Props> = (props) => {
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
        fontSize: 14,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 21,
        letterSpacing: 0.0025,
        textAlign: "left",
        color: theme.colors.text,
    }
}))