import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ChainLinkScreensStackParams} from "../../types/navigation";
import {Button, StyledSafeAreaView, TextInput, TopBar, Typography} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {checkMnemonic} from "../../wallet/LocalWallet";
import {EnglishMnemonic} from "@cosmjs/crypto";
import {FlexPadding} from "../../components/FlexPadding";

export type Props = StackScreenProps<ChainLinkScreensStackParams, "LinkWithMnemonic">

export const LinkWithMnemonic: React.FC<Props> = ({navigation, route}) => {
    const {importMode, chain, feeGranter, backAction} = route.params
    const styles = useStyles();
    const {t} = useTranslation();
    const [mnemonic, setMnemonic] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
            navigation.navigate({
                name: "PickAddress",
                params: {
                    importMode,
                    chain,
                    mnemonic,
                    feeGranter,
                    backAction
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
        topBar={<TopBar stackProps={{navigation}} />}
    >
        <Typography.Body>
            {t("please enter you recovery passphrase")}.
        </Typography.Body>

        <Typography.Body
            style={styles.mnemonicInputLabel}
        >
            {t("recovery passphrase")}
        </Typography.Body>
        <TextInput
            style={styles.mnemonicInput}
            placeholder={t("enter recovery passphrase placeholder")}
            value={mnemonic}
            multiline={true}
            onChangeText={onMnemonicChange}
            autoFocus={true}
        />

        {errorMessage !== null && <Typography.Body
            style={styles.errorParagraph}
        >
            {errorMessage}
        </Typography.Body>}

        <FlexPadding flex={1}/>

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
    mnemonicInputLabel: {
        marginTop: theme.spacing.l,
        textTransform: "capitalize"
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
        color: theme.colors.font.red,
    },
}));