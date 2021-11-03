import React, {useCallback, useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {randomMnemonic} from "../../wallet/LocalWallet";
import {StyledSafeAreaView, Button, MnemonicGrid, Typography} from "../../components";
import {useTranslation, Trans} from "react-i18next";
import {makeStyle} from "../../theming";
import {View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import Colors from "../../constants/colors";
import {TopBar} from "../../components";
import {ActivityIndicator} from "react-native-paper";

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateNewMnemonic">;

export default function GenerateNewMnemonic(props: Props): JSX.Element {

    const {navigation} = props;
    const styles = useStyles();
    const {t} = useTranslation();
    const [mnemonic, setMnemonic] = useState<string | null>(null)
    const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(24);
    const [generationDelay, setGenerationDelay] = useState(1500);
    const generatingMnemonic = mnemonic === null;

    const generateMnemonic = useCallback(async (length: 12 | 24) => {
        if (generationDelay > 0) {
            return new Promise<string>((resolve) => {
                setTimeout(() => {
                    resolve(randomMnemonic(length))
                }, generationDelay);
                setGenerationDelay(0);
            })
        } else {
            return randomMnemonic(length)
        }
    }, [generationDelay]);

    const onChangeLengthChanged = useCallback(async () => {
        let newLength: 12 | 24 = mnemonicLength === 24 ? 12 : 24;
        setMnemonicLength(newLength);
        setMnemonic(null);
        const newMnemonic = await generateMnemonic(newLength);
        setMnemonic(newMnemonic);
    }, [generateMnemonic, mnemonicLength]);

    // Hook to launch the generation when the user enter on the screen
    useEffect(() => {
        generateMnemonic(mnemonicLength)
            .then(setMnemonic)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onOkPressed = () => {
        navigation.navigate({
            name: "CheckMnemonic",
            params: {
                mnemonic: mnemonic!,
            }
        });
    }

    return <StyledSafeAreaView
        style={styles.root}
        topBar={<TopBar stackProps={props} />}
    >
        <Typography.Title>
            {t("secret recovery passphrase")}
        </Typography.Title>
        <Typography.Subtitle
            style={styles.saveMnemonicAdvice}
        >
            <Trans
                i18nKey="save the recovery passphrase"
                components={{
                    bold: <Typography.Subtitle style={{
                        color: Colors.DesmosOrange,
                        fontFamily: "Poppins-Bold",
                        fontWeight: "bold"
                    }}/>
                }}
            >
            </Trans>
        </Typography.Subtitle>

        {generatingMnemonic ? (
            <View style={styles.loadingView}>
                <ActivityIndicator
                    size={"large"}
                />
            </View>
        ) : (
            <>
                <MnemonicGrid
                    style={styles.mnemonic}
                    mnemonic={mnemonic!}
                />
                <View style={styles.wordsBtnContainer}>
                    <Button
                        onPress={onChangeLengthChanged}
                    >
                        {mnemonicLength === 12 ? 24 : 12} {t("words")}
                    </Button>
                </View>
                <FlexPadding flex={1}/>
            </>
        )}
        <Button
            onPress={onOkPressed}
            mode="contained"
            labelStyle={styles.saveButton}
            disabled={generatingMnemonic}
        >
            {t("mnemonic saved")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle((theme) => ({
    root: {
        paddingTop: 0,
    },
    loadingView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    saveMnemonicAdvice: {
        marginTop: theme.spacing.s,
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