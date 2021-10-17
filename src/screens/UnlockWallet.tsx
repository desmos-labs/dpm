import React, {useCallback, useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {SecureTextInput} from "../components/SecureTextInput";
import {useTranslation} from "react-i18next";
import {Button, Paragraph, StyledSafeAreaView, Subtitle, TopBar} from "../components";
import WalletSource from "../sources/LocalWalletsSource";
import {makeStyle} from "../theming";
import {FlexPadding} from "../components/FlexPadding";
import {TouchableOpacity} from "react-native";

type Props = StackScreenProps<AccountScreensStackParams, "UnlockWallet">

export const UnlockWallet: React.FC<Props> = (props) => {
    const {address, resolve} = props.route.params;
    const styles = useStyles();
    const {t} = useTranslation();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [password, setPassword] = useState<string>("");

    useEffect(() => {
        return props.navigation.addListener("beforeRemove", e => {
            if (e.data.action.type === "GO_BACK") {
                resolve(null);
            }
        })
    }, [props.navigation, resolve])

    const unlockWallet = useCallback(async () => {
        setLoading(true);
        try {
            const wallet = await WalletSource.getWallet(address, password);
            setLoading(false);
            resolve(wallet);
            props.navigation.goBack();
        } catch (e) {
            setError(t("invalid password"));
        }
        setLoading(false);
    }, [address, password, props.navigation, resolve, t]);

    const resetPassword = useCallback(() => {
        console.warn("Not implemented");
    }, [])

    return <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t("wallet password")} />}
    >
        <Subtitle>
            {t("please enter you wallet password")}
        </Subtitle>
        <SecureTextInput
            style={styles.password}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={unlockWallet}
            placeholder={t("password")}
        />
        <Paragraph
            style={styles.errorMsg}
        >
            {error}
        </Paragraph>
        <FlexPadding flex={1} />
        <Button
            mode="contained"
            onPress={unlockWallet}
            loading={loading}
            disabled={loading}
        >
            {loading ? t("unlocking") : t("confirm")}
        </Button>
        <TouchableOpacity
            onPress={resetPassword}
            style={styles.forgotPasswordBtn}
        >
            <Paragraph>{t("forgot password?")}</Paragraph>
        </TouchableOpacity>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    password: {
        marginTop: theme.spacing.s,
    },
    errorMsg: {
        color: theme.colors.error,
        marginTop: theme.spacing.s
    },
    forgotPasswordBtn: {
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "center",
        padding: theme.spacing.s,
        marginTop: theme.spacing.s,
    },
}))