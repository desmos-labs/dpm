import React, {useMemo, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {randomMnemonic} from "../../wallet/LocalWallet";
import {StyledSafeAreaView, Button, MnemonicGrid} from "../../components";
import {Paragraph, Title} from "react-native-paper";
import {useTranslation, Trans} from "react-i18next";
import {makeStyle} from "../../theming";
import {Text, View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import Colors from "../../constants/colors";
const useStyles = makeStyle((theme) => ({
    root: {
        paddingTop: 0,
    },
    title: {
        textTransform: "capitalize",
    },
    saveMnemonicAdvice: {
        marginTop: theme.spacing.s,
        fontWeight: "bold"
    },
    mnemonic: {
        marginTop: theme.spacing.m
    },
    wordsBtnContainer: {
        display: "flex",
        flexDirection: "row-reverse",
    },
    saveButton: {
        fontStyle: "normal",
        textTransform: "none",
    }
}))

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateNewMnemonic">;

export default function GenerateNewMnemonic(props: Props): JSX.Element {

    const {navigation} = props;
    const styles = useStyles();
    const {t} = useTranslation();
    const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(24);
    const newMnemonic = useMemo(() => {
        return randomMnemonic(mnemonicLength);
    }, [mnemonicLength]);

    const onChangeLengthChanged = () => {
        if (mnemonicLength === 24) {
            setMnemonicLength(12);
        } else {
            setMnemonicLength(24);
        }
    }

    const onOkPressed = () => {
        navigation.navigate({
            name: "CheckMnemonic",
            params: {
                mnemonic: newMnemonic,
            }
        });
    }

    return <StyledSafeAreaView style={styles.root}>
        <Title style={styles.title}>
            {t("secrete recovery passphrase")}
        </Title>
        <Paragraph
            style={styles.saveMnemonicAdvice}
        >
            <Trans
                i18nKey="save the recovery passphrase"
                components={{
                    bold: <Text style={{
                        color: Colors.DesmosOrange
                    }}/>
                }}
            >
            </Trans>
        </Paragraph>

        <MnemonicGrid
            style={styles.mnemonic}
            mnemonic={newMnemonic}
        />

        <View style={styles.wordsBtnContainer}>
            <Button
                onPress={onChangeLengthChanged}
                color={Colors.DesmosBlue}
            >
                {mnemonicLength === 12 ? 24 : 12} {t("words")}
            </Button>
        </View>

        <FlexPadding flex={1}/>

        <Button onPress={onOkPressed} mode="contained" labelStyle={styles.saveButton}>
            {t("mnemonic saved")}
        </Button>
    </StyledSafeAreaView>
}