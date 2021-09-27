import React, {useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import ChainAccount, {ChainAccountType} from "../../types/chainAccount";
import useSaveWallet from "../../hooks/useSaveWallet";
import useSaveAccount from "../../hooks/useSaveAccount";
import {StyledSafeAreaView, Button, Title, Paragraph} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import useSaveSelectedAccount from "../../hooks/useSaveSelectedAccount";
import {useSetRecoilState} from "recoil";
import AccountStore from "../../store/AccountStore";
import {Image} from "react-native";

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateAccount">;

export default function GenerateAccount(props: Props): JSX.Element {

    const {t} = useTranslation();
    const styles = useStyles();
    const [generating, setGenerating] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [account, setAccount] = useState<ChainAccount | null>(null);
    const setSelectedAccount = useSetRecoilState(AccountStore.selectedAccount);
    const setAccounts = useSetRecoilState(AccountStore.chainAccounts);
    const saveWallet = useSaveWallet();
    const saveAccount = useSaveAccount();
    const saveSelectedAccount = useSaveSelectedAccount();

    const generateAccount = async () => {
        setGenerating(true);
        try {
            const {wallet, password} = props.route.params;
            await saveWallet(wallet, password);
            const account: ChainAccount = {
                type: ChainAccountType.Local,
                name: wallet.bech32Address,
                address: wallet.bech32Address,
            }
            await saveAccount(account);
            await saveSelectedAccount(account);
            setAccount(account);
        } catch (e) {
            setError(e.toString());
        }
        setGenerating(false);
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


    return <StyledSafeAreaView style={styles.root}>
        {generating ? (
            <Title
                style={styles.generatingText}
            >
                {t("generating account")}...
            </Title>
        ) : account !== null ? (<>
            <Image
                style={styles.icon}
                source={require("../../assets/success.png")}
                resizeMode="center"
            />

            <Title>
                {t("success")}
            </Title>
            <Paragraph fontSize={16}>
                {t("account created")}
            </Paragraph>

            <Button
                style={styles.continueButton}
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
        </>) : (<>
            <Paragraph
                style={styles.errorText}
            >
                {t("error generating account")}
            </Paragraph>
            <Paragraph
                style={styles.errorText}
            >
                {error}
            </Paragraph>
        </>)}
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    root: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    generatingText: {
    },
    icon: {
        height: 100,
    },
    continueButton: {
        alignSelf: "auto",
        marginTop: theme.spacing.s,
    },
    errorText: {
        color: theme.colors.error,
    }
}))