import React from "react";
import {SafeAreaView, ScrollView, StyleProp, StyleSheet, ViewProps} from "react-native";
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

export type Props = ViewProps & {
    /**
     * True if the content should be wrapped inside a ScrollView.
     */
    scrollable?: boolean
};

const StyledSafeAreaView: React.FC<Props> = (props) => {
    const classes = useClasses();

    const style = StyleSheet.compose(classes.root as StyleProp<ViewProps>, props.style);
    return <SafeAreaView {...props} style={style}>
        {props?.scrollable ? (
            <ScrollView>
                {props.children}
            </ScrollView>
        ) : props.children }
    </SafeAreaView>
}

export default StyledSafeAreaView;