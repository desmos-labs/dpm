import React, {useCallback, useEffect, useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {SecureTextInput} from "../components/SecureTextInput";
import {useTranslation} from "react-i18next";
import {Button, StyledSafeAreaView, TopBar, Typography} from "../components";
import WalletSource from "../sources/LocalWalletsSource";
import {makeStyle} from "../theming";
import {FlexPadding} from "../components/FlexPadding";


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


    return <StyledSafeAreaView
        topBar={<TopBar stackProps={props} title={t("wallet password")} />}
    >
        <Typography.Subtitle>
            {t("please enter you wallet password")}
        </Typography.Subtitle>
        <SecureTextInput
            style={styles.password}
            value={password}
            onChangeText={setPassword}
            onSubmitEditing={unlockWallet}
            placeholder={t("password")}
            autoFocus={true}
        />
        <Typography.Body
            style={styles.errorMsg}
        >
            {error}
        </Typography.Body>
        <FlexPadding flex={1} />
        <Button
            mode="contained"
            onPress={unlockWallet}
            loading={loading}
            disabled={loading}
        >
            {loading ? t("unlocking") : t("confirm")}
        </Button>
        {/*<TouchableOpacity*/}
        {/*    onPress={resetPassword}*/}
        {/*    style={styles.forgotPasswordBtn}*/}
        {/*>*/}
        {/*    <Typography.Body>{t("forgot password?")}</Typography.Body>*/}
        {/*</TouchableOpacity>*/}
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