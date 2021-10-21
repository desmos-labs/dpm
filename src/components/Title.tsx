import React from "react";
import {Title as MaterialTitle} from "react-native-paper"
import {Text} from "react-native";
import {makeStyleWithProps} from "../theming";

type Props = React.ComponentProps<typeof Text> & {
    capitalize?: boolean
}

export const Title: React.FC<Props> = (props) => {
    const styles = useStyles(props);

    return <MaterialTitle {...props}
        style={[styles.title, props.style]}
    >
        {props.children}
    </MaterialTitle>
}

const useStyles = makeStyleWithProps((props: Props, theme) =>  ({
    title: {
        fontWeight: "700",
        fontSize: 22,
        textTransform: props.capitalize === false ? "none" : "capitalize",
        fontFamily: "SF Pro Text",
        color: theme.colors.text,
    }
}))