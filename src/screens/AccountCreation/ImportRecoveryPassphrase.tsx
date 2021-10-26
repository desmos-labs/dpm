import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {checkMnemonic} from "../../wallet/LocalWallet";
import {Title, Paragraph, TextInput, StyledSafeAreaView, Button, Subtitle} from "../../components";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {EnglishMnemonic} from "@cosmjs/crypto";
import {FlexPadding} from "../../components/FlexPadding";
import {TopBar} from "../../components";
import useCloseKeyboard from "../../hooks/useCloseKeyboard";


declare type Props = StackScreenProps<AccountCreationStackParams, "ImportRecoveryPassphrase">;

export default function ImportRecoveryPassphrase(props: Props): JSX.Element {

    const styles = useStyles();
    const {t} = useTranslation();
    const [mnemonic, setMnemonic] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const closeKeyboard = useCloseKeyboard();

    const onMnemonicChange = (mnemonic: string) => {
        if (mnemonic.indexOf("\n") === -1) {
            setMnemonic(mnemonic);
            setErrorMessage(null);
        } else {
            onNextPressed();
        }
    }

    const onNextPressed = () => {
        if (checkMnemonic(mnemonic)) {
            props.navigation.navigate({
                name: "PickDerivationPath",
                params: {
                    mnemonic: mnemonic,
                }
            })
        } else {
            const invalidWords = mnemonic.split(" ").filter(w => {
                return w.length > 0 && EnglishMnemonic.wordlist.indexOf(w) === -1
            }).join(",");

            if (invalidWords.length > 0) {
                setErrorMessage(`${t("invalid words")}:\n${invalidWords}`)
            } else {
                setErrorMessage(t("invalid recovery passphrase"));
            }
        }
    }
    
    const useDebugMnemonic = () => {
        setMnemonic("hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet");
        setErrorMessage(null);
    }
    
    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar stackProps={props} />}
    >
        <Title>
            {t("import recovery passphrase")}
        </Title>
        <Paragraph>{t("please enter you recovery passphrase")}.</Paragraph>

        <Subtitle
            style={styles.mnemonicInputLabel}
            capitalize
        >
            {t("recovery passphrase")}
        </Subtitle>
        <TextInput
            style={styles.mnemonicInput}
            placeholder={t("enter recovery passphrase placeholder")}
            value={mnemonic}
            multiline={true}
            onChangeText={onMnemonicChange}
            autoFocus={true}
        />

        {errorMessage !== null && <Paragraph
            style={styles.errorParagraph}
        >
            {errorMessage}
        </Paragraph>}

        <FlexPadding
            flex={1}
            onPress={closeKeyboard}
        />

        {__DEV__ && <Button
            mode="contained"
            onPress={useDebugMnemonic}
        >
            Use debug mnemonic
        </Button>}
        <Button
            mode="contained"
            onPress={onNextPressed}
        >
            {t("next")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        paddingTop: 0,
    },
    mnemonicInputLabel: {
        marginTop: theme.spacing.l,
    },
    mnemonicInput: {
        marginTop: theme.spacing.s,
        minHeight: 150,
    },
    advanceSettingsBtn: {
        marginTop: theme.spacing.s,
    },
    errorParagraph: {
        marginBottom: theme.spacing.s,
        color: theme.colors.error,
    },
}))