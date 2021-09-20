import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {Button, MnemonicViewer, StyledSafeAreaView} from "../../components";
import {Paragraph, Subheading} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";

const useClasses = makeStyle(theme => ({
    mnemonic: {
        marginTop: theme.spacing.s,
        marginBottom: theme.spacing.s,
    },
    errorParagraph: {
        marginBottom: theme.spacing.s,
        color: theme.colors.error,
        flexGrow: 1,
    },
    saveButton: {

    }
}));

declare type Props = StackScreenProps<AccountCreationStackParams, "CheckMnemonic">;
export default function CheckMnemonic(props: Props): JSX.Element {

    const classes = useClasses();
    const {t} = useTranslation();
    const receivedMnemonic = props.route.params.mnemonic;
    const [userMnemonic, setUserMnemonic] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onMnemonicChange = (mnemonic: string, wordCount: number, invalidWords: string[]) => {
        setUserMnemonic(mnemonic);
        if (invalidWords.length > 0) {
            setErrorMessage(`${t("invalid passphrase words")}:\n` + invalidWords.join("\n"));
        } else {
            setErrorMessage(null);
        }
    }

    const onCheckPressed = () => {
        if (receivedMnemonic === userMnemonic) {
            props.navigation.navigate({
                name: "CreateWalletPassword",
                params: {
                    ...props.route.params,
                    mnemonic: userMnemonic,
                }
            });
        } else {
            setErrorMessage(t("invalid recovery passphrase"));
        }
    }

    return <StyledSafeAreaView>
        <Subheading>
            {t("please check your recovery passphrase")}
        </Subheading>
        <MnemonicViewer
            style={classes.mnemonic}
            editable={true}
            onChange={onMnemonicChange}
        />
        <Paragraph style={classes.errorParagraph}>
            {errorMessage}
        </Paragraph>
        <Button onPress={onCheckPressed} mode="contained">
            {t("check")}
        </Button>
    </StyledSafeAreaView>
}