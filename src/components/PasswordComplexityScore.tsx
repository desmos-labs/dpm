import React, {useMemo} from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native"
import {useTheme} from "react-native-paper";
import {makeStyle} from "../theming";

export type PasswordComplexityScore = 0 | 1 | 2 | 3 | 4;

export type Props = {
    score: PasswordComplexityScore
}

export const PasswordComplexity: React.FC<Props> = props => {
    const theme = useTheme();
    const styles = useStyle();

    const boxStyles = useMemo(() => {
        let scoreColor = theme.colors.surface
        switch (props.score) {
            case 1:
                scoreColor = theme.colors.passwordComplexity.weak;
                break;
            case 2:
                scoreColor = theme.colors.passwordComplexity.normal;
                break;

            case 3:
                scoreColor = theme.colors.passwordComplexity.strong;
                break;

            case 4:
                scoreColor = theme.colors.passwordComplexity.veryStrong;
                break;
        }

        let boxStyles: StyleProp<ViewStyle>[] = [];
        for (let i = 0; i < 4; i++) {
            let style: StyleProp<ViewStyle>;
            if (i < props.score) {
                style = StyleSheet.compose(styles.scoreField as StyleProp<ViewStyle>, {
                    backgroundColor: scoreColor
                });
            } else {
                style = styles.scoreField as StyleProp<ViewStyle>;
            }
            boxStyles.push(style)
        }
        return boxStyles;
    }, [theme.colors, styles.scoreField, props.score]);

    return <View style={styles.container}>
        <View style={boxStyles[0]}/>
        <View style={boxStyles[1]}/>
        <View style={boxStyles[2]}/>
        <View style={boxStyles[3]}/>
    </View>
}

const useStyle = makeStyle(theme => ({
    container: {
        display: "flex",
        flexDirection: "row",
    },
    scoreField: {
        height: 2,
        width: 10,
        backgroundColor: theme.colors.surface,
        marginRight: 4,
    }
}));