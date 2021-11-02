import React, {useCallback, useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {Button, MnemonicWordBadge, StyledSafeAreaView, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {View} from "react-native";
import {shuffleArray} from "../../utilils/shuffle";
import {TopBar} from "../../components";

declare type Props = StackScreenProps<AccountCreationStackParams, "CheckMnemonic">;
export default function CheckMnemonic(props: Props): JSX.Element {

    const styles = useStyles();
    const {t} = useTranslation();
    const receivedMnemonic = props.route.params.mnemonic;
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const words = useMemo(() => {
        return shuffleArray(receivedMnemonic.split(" "), 100);
    }, [receivedMnemonic]);
    const [selectedWords, setSelectedWords] = useState<string[]>([]);
    const [availableWords, setAvailableWords] = useState<string[]>([...words]);

    const onWordSelected = useCallback((word: string) => {
        const removeIndex = availableWords.indexOf(word);
        if (removeIndex >= 0) {
            availableWords.splice(removeIndex, 1);
            setAvailableWords(availableWords);
            setSelectedWords([...selectedWords, word]);
        }
    }, [availableWords, selectedWords]);

    const onWordDeselected = useCallback((word: string) => {
        const removeIndex = selectedWords.indexOf(word);
        setErrorMessage(null);
        if (removeIndex >= 0) {
            selectedWords.splice(removeIndex, 1);
            setSelectedWords(selectedWords);
            setAvailableWords([...availableWords, word]);
        }
    }, [availableWords, selectedWords]);

    const onCheckPressed = useCallback(() => {
        if (selectedWords.length !== words.length) {
            setErrorMessage(t("invalid recovery passphrase"));
        }
        else {
            const composedMnemonic = selectedWords.join(" ");
            if (receivedMnemonic === composedMnemonic) {
                props.navigation.navigate({
                    name: "PickDerivationPath",
                    params: {
                        mnemonic: composedMnemonic,
                    }
                })
            } else {
                setErrorMessage(t("invalid recovery passphrase"));
            }
        }
    }, [props.navigation, receivedMnemonic, selectedWords, t, words.length])

    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar stackProps={props} />}
    >
        <Typography.Title>
            {t("confirm recovery passphrase")}
        </Typography.Title>
        <Typography.Subtitle2>
            {t("select each word in order")}.
        </Typography.Subtitle2>

        <View style={styles.selectedWordsContainer}>
            {selectedWords.map((w, i) => <MnemonicWordBadge
                style={styles.wordBadge}
                key={`${w}-${i}`}
                value={w}
                onPress={onWordDeselected}
            />)}
        </View>
        <View style={styles.availableWordsContainer}>
            {availableWords.map((w, i) =>
                <MnemonicWordBadge
                    style={styles.wordBadge}
                    key={`${w}-${i}`}
                    value={w}
                    onPress={onWordSelected}
                />)}
        </View>

        <Typography.Body style={styles.errorParagraph}>
            {errorMessage}
        </Typography.Body>
        <Button onPress={onCheckPressed} mode="contained">
            {t("check")}
        </Button>
        {__DEV__ && <Button onPress={() => {
            setAvailableWords([]);
            setSelectedWords(props.route.params.mnemonic.split(" "));
        }} mode="contained">
            (DBG) Auto sort
        </Button>}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
    },
    selectedWordsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: theme.spacing.s,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: theme.roundness,
        borderColor: theme.colors.surface,
        flexGrow: 1,
        maxHeight: "50%",
    },
    availableWordsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: theme.spacing.s,
        flexGrow: 1,
    },
    wordBadge: {
        marginTop: theme.spacing.s,
        marginLeft: theme.spacing.s,
        marginRight: theme.spacing.s,
    },
    errorParagraph: {
        marginBottom: theme.spacing.s,
        color: theme.colors.error,
    },
    saveButton: {

    }
}));