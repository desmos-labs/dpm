import React from "react";
import {Text} from "react-native"
import {makeStyle} from "../../theming";

export type Props = React.ComponentProps<typeof Text>;


export const Caption: React.FC<Props> = (props) => {
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
        color: theme.colors.text,
        fontSize: 12,
        fontStyle: "normal",
        fontWeight: "400",
        lineHeight: 18,
        letterSpacing: 0.004,
        textAlign: "left",
    }
}))