import React, {useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import useCreateLocalWallet from "../../hooks/useCreateLocalWallet";
import ChainAccount, {ChainAccountType} from "../../types/chainAccount";
import useSaveWallet from "../../hooks/useSaveWallet";
import useSaveAccount from "../../hooks/useSaveAccount";
import {DeferredState} from "../../types/defered";
import {StyledSafeAreaView, Button} from "../../components";
import {useTranslation} from "react-i18next";
import {Headline, Paragraph} from "react-native-paper";
import {makeStyle} from "../../theming";

const useClasses = makeStyle(theme => ({
    root: {
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "center"
    },
    generatingText: {
        textAlign: "center",
    },
    continueButton: {
        marginTop: theme.spacing.s,
    },
    errorText: {
        color: theme.colors.error,
    }
}))

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateAccountKeys">;

export default function GenerateAccountKeys(props: Props): JSX.Element {

    const {t} = useTranslation();
    const classes = useClasses();
    const {mnemonic, hdPath, name} = props.route.params;
    const [createWalletStatus, create] = useCreateLocalWallet();
    const [saveWalletStatus, saveWallet] = useSaveWallet();
    const [saveAccountStatus, saveAccount] = useSaveAccount()

    const onContinuePressed = () => {
        const wallet = createWalletStatus!.value();
        const account: ChainAccount = {
            type: ChainAccountType.Local,
            name: name,
            address: wallet.bech32Address,
        }
        saveWallet(wallet!, props.route.params.password);
        saveAccount(account);
    }

    useEffect(() => {
        return props.navigation.addListener("beforeRemove", e => {
            if (createWalletStatus === null || createWalletStatus.isPending() || createWalletStatus.isCompleted()) {
                e.preventDefault();
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [createWalletStatus])

    useEffect(() => {
        create(mnemonic, {
            hdPath
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (saveWalletStatus?.isCompleted() && saveAccountStatus?.isCompleted()) {
            props.navigation.popToTop();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [saveWalletStatus, saveAccountStatus])


    if (createWalletStatus === null || createWalletStatus?.isPending()) {
        return <StyledSafeAreaView
            style={classes.root}
        >
            <Paragraph
                style={classes.generatingText}
            >
                {t("generating account keys")}
            </Paragraph>
        </StyledSafeAreaView>
    } else {
        switch (createWalletStatus.state()) {
            case DeferredState.Completed:
                const wallet = createWalletStatus.value();
                return <StyledSafeAreaView
                    style={classes.root}
                >
                    <Headline>{t("account created")}</Headline>
                    <Paragraph>{t("address")}: {wallet.bech32Address}</Paragraph>
                    <Button
                        style={classes.continueButton}
                        mode="contained"
                        onPress={onContinuePressed}
                    >
                        {t("continue")}
                    </Button>
                    {__DEV__ && <Button
                        mode="contained"
                        onPress={() => {
                            create(mnemonic, {
                                hdPath
                            })
                        }}
                    >
                        (DBG) Regenerate keys
                    </Button>}
                </StyledSafeAreaView>

            case DeferredState.Failed:
                return <StyledSafeAreaView
                    style={classes.root}
                >
                    <Paragraph
                        style={classes.errorText}
                    >
                        {t("error generating account keys")}
                    </Paragraph>
                    <Paragraph
                        style={classes.errorText}
                    >
                        {createWalletStatus.error()}
                    </Paragraph>
                </StyledSafeAreaView>

            default:
                return <StyledSafeAreaView
                    style={classes.root}
                >
                    <Paragraph
                        style={classes.errorText}
                    >
                        Unknown state
                    </Paragraph>
                </StyledSafeAreaView>
        }
    }
}