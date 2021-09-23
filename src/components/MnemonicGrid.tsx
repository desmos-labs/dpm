import React, {useMemo} from "react";
import {StyleProp, StyleSheet, View, ViewStyle} from "react-native";
import {MnemonicWordBadge} from "./MnemonicWordBadge";
import {makeStyle} from "../theming";

export type Props = {
    /**
     * The mnemonic that will be displayed.
     */
    mnemonic: string,
    style?: StyleProp<ViewStyle>
}

export const MnemonicGrid: React.FC<Props> = (props) => {
    const styles = useStyles();

    const words = useMemo(() => props.mnemonic.split(" "), [props.mnemonic]);
    const wordMatrix = useMemo(() => {
        const lines = words.length / 3;
        const matrix: string[][] = [];
        for (let l = 0; l < lines; l++) {
            const start = 3 * l;
            const end = 3 * (l + 1);
            matrix.push(words.slice(start, end));
        }
        return matrix;
    }, [words]);

    const components = useMemo(() => {
        return wordMatrix.map((row, rI) => {
            return <View key={`row-${rI}`} style={styles.row}>
                {row.map((w, wI) => {
                    const wordIndex = (rI * 3) + wI + 1;
                    return <MnemonicWordBadge
                        key={`word-${wordIndex}`}
                        style={styles.word}
                        value={w}
                        index={wordIndex}
                    />
                })}
            </View>
        })
    }, [wordMatrix, styles])

    return <View style={StyleSheet.compose(props.style, styles.root)}>
        {components}
    </View>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        flexDirection: "column",
    },
    row: {
        display: "flex",
        flexDirection: "row",
    },
    word: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        margin: theme.spacing.s,
    }
}))