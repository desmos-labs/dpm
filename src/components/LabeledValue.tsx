import React from "react";
import {View} from "react-native";
import {Subtitle} from "./Subtitle";
import {Paragraph} from "./Paragraph";
import {makeStyle} from "../theming";

export type Props = {
    /**
     * Label that describe the value.
     */
    label: string,
    /**
     * The value to display to the user.
     */
    value?: string
}

export const LabeledValue: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <View style={styles.root}>
        <Subtitle>{props.label}</Subtitle>
        <Paragraph>{props.value}</Paragraph>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        padding: theme.spacing.s,
    }
}));