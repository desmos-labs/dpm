import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {randomMnemonic} from "../../wallet/LocalWallet";
import {MnemonicViewer, StyledSafeAreaView, Button, HdPathPicker} from "../../components";
import {TextInput, Paragraph, Subheading} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {HdPath, DefaultHdPath} from "../../types/hdpath";
import {View} from "react-native";
import {isHdPathValid} from "../../utilils/hdPath";

const useClasses = makeStyle((theme) => ({
    typography: {
        marginTop: theme.spacing.s
    },
    mnemonic: {
        marginTop: theme.spacing.s
    },
    advanceSettingsBtn: {
        marginTop: theme.spacing.s,
    },
    errorParagraph: {
        color: theme.colors.error
    },
    saveMnemonicAdvice: {
        marginTop: theme.spacing.s,
        flexGrow: 1,
        fontWeight: "bold"
    },
    saveButton: {
        fontStyle: "normal",
        textTransform: "none",
    }
}))

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateNewMnemonic">;

export default function GenerateNewMnemonic(props: Props): JSX.Element {

    const {navigation} = props;
    const classes = useClasses();
    const {t} = useTranslation();
    const [accountName, setAccountName] = useState("Desmos Account");
    const [newMnemonic, ] = useState(randomMnemonic());
    const [hdPath, setHdPath] = useState(DefaultHdPath)
    const [showAdvanceSettings, setShowAdvanceSettings] = useState(false);
    const [hdPathError, setHdPathError] = useState<string | null>(null);

    const onHdPathChange = (hdPath: HdPath) => {
        setHdPath(hdPath);
        if (isHdPathValid(hdPath)) {
            setHdPathError(null);
        } else {
            setHdPathError(t("invalid hd path"));
        }
    }

    const onAdvanceSettingPressed = () => {
        setShowAdvanceSettings(!showAdvanceSettings);
        if (showAdvanceSettings) {
            setHdPath(DefaultHdPath);
            setHdPathError(null);
        }
    }

    const onOkPressed = () => {
        if (hdPathError === null) {
            navigation.navigate({
                name: "CheckMnemonic",
                params: {
                    mnemonic: newMnemonic,
                    name: accountName,
                    password: "",
                    hdPath,
                }
            });
        }
    }

    return <StyledSafeAreaView>
        <Subheading
            style={classes.typography}
        >
            {t("account name")}:
        </Subheading>
        <TextInput
            mode="outlined"
            onChangeText={setAccountName}
            value={accountName}
        />

        <Subheading
            style={classes.typography}
        >
            {t("recovery passphrase")}:
        </Subheading>
        <MnemonicViewer
            style={classes.mnemonic}
            mnemonic={newMnemonic}
            editable={false}
            copyBtn
        />

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

        <Paragraph
            style={classes.saveMnemonicAdvice}
        >
            {t("save the recovery passphrase")}
        </Paragraph>
        <Button onPress={onOkPressed} mode="contained" labelStyle={classes.saveButton}>
            {t("mnemonic saved")}
        </Button>
    </StyledSafeAreaView>
}