import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import useCreateLocalWallet from "../../hooks/useCreateLocalWallet";
import ChainAccount, {ChainAccountType} from "../../types/chainAccount";
import useSaveWallet from "../../hooks/useSaveWallet";
import useSaveAccount from "../../hooks/useSaveAccount";
import {StyledSafeAreaView, Button} from "../../components";
import {useTranslation} from "react-i18next";
import {Headline, Paragraph} from "react-native-paper";
import {makeStyle} from "../../theming";
import useSaveSelectedAccount from "../../hooks/useSaveSelectedAccount";
import {useSetRecoilState} from "recoil";
import AccountStore from "../../store/AccountStore";

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
    const [generating, setGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<ChainAccount | null>(null);
    const setSelectedAccount = useSetRecoilState(AccountStore.selectedAccount);
    const setAccounts = useSetRecoilState(AccountStore.chainAccounts);
    const createLocalWallet = useCreateLocalWallet();
    const saveWallet = useSaveWallet();
    const saveAccount = useSaveAccount();
    const saveSelectedAccount = useSaveSelectedAccount();

    const generateAccount = async () => {
        setGenerating(true);
        try {
            const wallet = await createLocalWallet(mnemonic, {
                hdPath
            });
            await saveWallet(wallet, props.route.params.password);
            const account: ChainAccount = {
                type: ChainAccountType.Local,
                name: name,
                address: wallet.bech32Address,
            }
            await saveAccount(account);
            await saveSelectedAccount(account)
            setAccount(account);
            setGenerating(false);
        } catch (e) {
            setGenerating(false);
            setError(e.toString());
        }
    }

    const onContinuePressed = () => {
        setAccounts((old) => [...old, account!]);
        setSelectedAccount(account!);
    }

    useEffect(() => {
        return props.navigation.addListener("beforeRemove", e => {
            e.preventDefault();
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        generateAccount();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    if (generating) {
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
        if (account !== null) {
            return <StyledSafeAreaView
                style={classes.root}
            >
                <Headline>{t("account created")}</Headline>
                <Paragraph>{t("address")}: {account.address}</Paragraph>
                <Button
                    style={classes.continueButton}
                    mode="contained"
                    onPress={onContinuePressed}
                >
                    {t("continue")}
                </Button>
                {__DEV__ && <Button
                    mode="contained"
                    onPress={() => generateAccount()}
                >
                    (DBG) Regenerate keys
                </Button>}
            </StyledSafeAreaView>
        } else {
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
                    {error}
                </Paragraph>
            </StyledSafeAreaView>
        }
    }
}