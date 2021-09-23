import React from "react";
import {View, Text, StyleProp, ViewStyle, StyleSheet} from "react-native";
import {makeStyle} from "../theming";

export type Props = {
    /**
     * The word to display.
     */
    value: string,
    /**
     * An optional word index that will be displayed on the top right corner.
     */
    index?: number,
    style?: StyleProp<ViewStyle>,
}

export const MnemonicWordBadge: React.FC<Props> = (props) => {
    const styles = useStyles();

    return <View style={StyleSheet.compose(styles.root as StyleProp<ViewStyle>, props.style)}>
        <Text style={styles.word}>
            {props.value}
        </Text>
        <Text style={styles.index}>
            {props.index}
        </Text>
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        backgroundColor: '#F5F5F5',
        borderRadius: 4,
        padding: theme.spacing.s
    },
    word: {

    },
    index: {
        position: "absolute",
        top: theme.spacing.s,
        right: theme.spacing.s,
        fontSize: 8,
    }
}));