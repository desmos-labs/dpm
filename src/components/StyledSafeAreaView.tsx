import React from "react";
import {SafeAreaView, StyleProp, StyleSheet, ViewProps} from "react-native";
import {makeStyle} from "../theming";

const useClasses = makeStyle((theme) =>({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: theme.spacing.m,
        backgroundColor: "#ffffff"
    }
}));

export type Props = ViewProps;

const StyledSafeAreaView: React.FC<Props> = (props) => {
    const classes = useClasses();

    const style = StyleSheet.compose(classes.root as StyleProp<ViewProps>, props.style);
    return <SafeAreaView {...props} style={style}/>
}

export default StyledSafeAreaView;