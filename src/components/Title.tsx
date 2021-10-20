import React from "react";
import {Title as MaterialTitle} from "react-native-paper"
import {Text} from "react-native";
import {makeStyle} from "../theming";

export const Title: React.FC<React.ComponentProps<typeof Text>> = (props) => {
    const styles = useStyles();

    return <MaterialTitle {...props}
        style={[styles.title, props.style]}
    >
        {props.children}
    </MaterialTitle>
}

const useStyles = makeStyle(theme => ({
    title: {
        fontWeight: "700",
        fontSize: 22,
        textTransform: "capitalize",
        fontFamily: "SF Pro Text",
        color: theme.colors.text,
    }
}))