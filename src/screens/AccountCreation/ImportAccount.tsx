import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {checkMnemonic} from "../../wallet/LocalWallet";
import {MnemonicViewer, StyledSafeAreaView, Button, HdPathPicker} from "../../components";
import {Paragraph, Subheading, TextInput} from "react-native-paper";
import {makeStyle} from "../../theming";
import {useTranslation} from "react-i18next";
import {DefaultHdPath, HdPath} from "../../types/hdpath";
import {View} from "react-native";
import {isHdPathValid} from "../../utilils/hdPath";

const useClasses = makeStyle(theme => ({
    typography: {
        marginTop: theme.spacing.s,
    },
    mnemonic: {
        marginTop: theme.spacing.s,
    },
    advanceSettingsBtn: {
        marginTop: theme.spacing.s,
    },
    errorParagraph: {
        marginBottom: theme.spacing.s,
        color: theme.colors.error,
    },
    padding: {
        flex: 1
    }
}))

declare type Props = StackScreenProps<AccountCreationStackParams, "ImportAccount">;

export default function ImportAccount(props: Props): JSX.Element {

    const classes = useClasses();
    const {t} = useTranslation();
    const [accountName, setAccountName] = useState("New Account");
    const [mnemonic, setMnemonic] = useState<string>("");
    const [hdPath, setHdPath] = useState(DefaultHdPath);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
    const [hdPathError, setHdPathError] = useState<string | null>(null);

    const onMnemonicChange = (mnemonic: string, wordCount: number, invalidWords: string[]) => {
        setMnemonic(mnemonic);
        if (invalidWords.length > 0) {
            setErrorMessage(`${t("invalid passphrase words")}:\n` + invalidWords.join("\n"));
        } else {
            setErrorMessage(null);
        }
    }

    const onAdvanceSettingPressed = () => {
        setShowAdvanceSettings(!showAdvanceSettings);
        if (showAdvanceSettings) {
            setHdPath(DefaultHdPath);
            setHdPathError(null);
        }
    }

    const onHdPathChange = (hdPath: HdPath) => {
        setHdPath(hdPath);
        if (isHdPathValid(hdPath)) {
            setHdPathError(null);
        } else {
            setHdPathError(t("invalid hd path"));
        }
    }

    const onRecoverPressed = () => {
        if (checkMnemonic(mnemonic)) {
            props.navigation.navigate({
                name: "CreateWalletPassword",
                params: {
                    mnemonic: mnemonic,
                    name: accountName,
                    password: "",
                    hdPath,
                }
            })
        } else {
            setErrorMessage("Invalid recovery passphrase")
        }
    }
    
    const useDebugMnemonic = () => {
        setMnemonic("hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet");
        setErrorMessage(null);
    }
    
    return <StyledSafeAreaView>
        <Subheading>
            {t("check recovery passphrase")}
        </Subheading>
        <TextInput
            style={classes.typography}
            mode="outlined"
            label={t("account name")}
            onChangeText={setAccountName}
            value={accountName}
        />
        <MnemonicViewer
            mnemonic={mnemonic}
            style={classes.mnemonic}
            editable={true}
            onChange={onMnemonicChange}
        />
        {errorMessage !== null && <Paragraph
            style={classes.errorParagraph}
        >
            {errorMessage}
        </Paragraph>}
        <Button
            style={classes.advanceSettingsBtn}
            mode="text"
            onPress={onAdvanceSettingPressed}
        >
            {t("advance wallet settings")}
        </Button>
        {showAdvanceSettings && <View>
            <Subheading
                style={classes.typography}
            >
                {t("hd path")}:
            </Subheading>
            <HdPathPicker onChange={onHdPathChange}/>
            <Paragraph
                style={classes.errorParagraph}
            >
                {hdPathError}
            </Paragraph>
        </View>}
        <View style={classes.padding}/>
        {__DEV__ && <Button
            mode="contained"
            onPress={useDebugMnemonic}
        >
            Use debug mnemonic
        </Button>}
        <Button
            mode="contained"
            onPress={onRecoverPressed}
        >
            {t("import account")}
        </Button>
    </StyledSafeAreaView>
}