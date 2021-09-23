import React, {useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {Button, MnemonicWordBadge, StyledSafeAreaView, Title} from "../../components";
import {Paragraph, Subheading} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {View} from "react-native";
import {shuffleArray} from "../../utilils/shuffle";

const useStyles = makeStyle(theme => ({
    root: {
        paddingTop: 0,
        display: "flex",
        flexDirection: "column",
    },
    title: {
        textTransform: "capitalize"
    },
    selectedWordsContainer: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: theme.spacing.s,
        borderStyle: "solid",
        borderWidth: 1,
        borderRadius: theme.roundness,
        borderColor: "#E8E8E8",
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
    const [availableWords, setAvailableWords] = useState<string[]>(words);

    const onWordSelected = (word: string) => {
        const removeIndex = availableWords.indexOf(word);
        if (removeIndex >= 0) {
            availableWords.splice(removeIndex, 1);
            setAvailableWords(availableWords);
            setSelectedWords([...selectedWords, word]);
        }
    }

    const onWordDeselected = (word: string) => {
        const removeIndex = selectedWords.indexOf(word);
        if (removeIndex >= 0) {
            selectedWords.splice(removeIndex, 1);
            setSelectedWords(selectedWords);
            setAvailableWords([...availableWords, word]);
        }
    }

    const onCheckPressed = () => {
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
    }

    return <StyledSafeAreaView style={styles.root}>
        <Title style={styles.title}>
            {t("confirm recovery passphrase")}
        </Title>
        <Subheading>
            {t("select each word in order")}.
        </Subheading>

        <View style={styles.selectedWordsContainer}>
            {selectedWords.map(w => <MnemonicWordBadge
                style={styles.wordBadge}
                key={w}
                value={w}
                onPress={onWordDeselected}
            />)}
        </View>
        <View style={styles.availableWordsContainer}>
            {availableWords.map(w =>
                <MnemonicWordBadge
                    style={styles.wordBadge}
                    key={w}
                    value={w}
                    onPress={onWordSelected}
                />)}
        </View>

        <Paragraph style={styles.errorParagraph}>
            {errorMessage}
        </Paragraph>
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