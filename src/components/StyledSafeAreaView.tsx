import React from "react";
import {SafeAreaView, ScrollView, StyleProp, StyleSheet, ViewProps} from "react-native";
import {makeStyleWithProps} from "../theming";

export type Props = ViewProps & {
    /**
     * True if the content should be wrapped inside a ScrollView.
     */
    scrollable?: boolean,
    /**
     * View padding.
     */
    padding?: number,
};

export const StyledSafeAreaView: React.FC<Props> = (props) => {
    const styles = useStyles(props);

    const style = StyleSheet.compose(styles.root as StyleProp<ViewProps>, props.style);
    return <SafeAreaView {...props} style={style}>
        {props?.scrollable ? (
            <ScrollView>
                {props.children}
            </ScrollView>
        ) : props.children }
    </SafeAreaView>
}

const useStyles = makeStyleWithProps((props: Props, theme) =>({
    root: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        padding: props?.padding ?? theme.spacing.m,
        backgroundColor: "#ffffff"
    }
}));
