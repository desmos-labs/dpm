import React from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {makeStyle} from "../theming";

export type Props = {
    style?: StyleProp<ViewStyle>,
}

export const Divider: (props: Props) => JSX.Element | null = (props) => {
    const styles = useStyles();

    return <View style={StyleSheet.compose(styles.divider as StyleProp<ViewStyle>, props.style)}/>
}

const useStyles = makeStyle(theme => ({
    divider: {
        height: 1,
        backgroundColor: theme.colors.line,
    }
}));