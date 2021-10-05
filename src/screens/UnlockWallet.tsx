import React, {useEffect, useState} from "react";
import {View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountScreensStackParams} from "../types/navigation";
import {SecureTextInput} from "../components/SecureTextInput";
import {useTranslation} from "react-i18next";
import {Button, Paragraph, StyledSafeAreaView} from "../components";
import WalletSource from "../sources/LocalWalletsSource";
import {Subheading, Surface, Title} from "react-native-paper";
import {makeStyle} from "../theming";

type Props = StackScreenProps<AccountScreensStackParams, "UnlockWallet">

const useStyles = makeStyle(theme => ({
    root: {
        backgroundColor: "rgba(200, 200, 200, 0.8)",
        flexDirection: "column-reverse",
        paddingLeft: 5,
        paddingRight: 5,
        paddingTop: 0,
        paddingBottom: 0,
    },
    fieldContainer: {
        padding: theme.spacing.m,
        borderRadius: theme.roundness * 2,
    },
    password: {
        marginTop: theme.spacing.s,
    },
    errorMsg: {
        color: theme.colors.error,
        marginTop: theme.spacing.s
    },
    buttonsContainer: {
        marginTop: theme.spacing.s,
        display: "flex",
        flexDirection: "row",
        width: "100%",
        justifyContent: "space-evenly"
    }
}))

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

    const unlockWallet = async () => {
        setLoading(true);
        try {
            const wallet = await WalletSource.getWallet(address, password);
            setLoading(false);
            resolve(wallet);
            props.navigation.pop();
        } catch (e) {
            setError(t("invalid password"));
        }
        setLoading(false);
    }

    const onCancel = () => {
        resolve(null);
        props.navigation.pop();
    }


    return <StyledSafeAreaView
        style={styles.root}
    >
        <Surface
            style={styles.fieldContainer}
        >
            <Title>
                {t("unlock wallet")}
            </Title>
            <Paragraph fontSize={16}>
                {t("password")}
            </Paragraph>
            <SecureTextInput
                style={styles.password}
                value={password}
                onChangeText={setPassword}
                placeholder={t("password")}
            />
            <Subheading
                style={styles.errorMsg}
            >
                {error}
            </Subheading>
            <View
                style={styles.buttonsContainer}
            >
                <Button
                    mode="outlined"
                    onPress={onCancel}
                    disabled={loading}
                >
                    {t("cancel")}
                </Button>
                <Button
                    mode="contained"
                    onPress={unlockWallet}
                    loading={loading}
                >
                    {t("unlock")}
                </Button>
            </View>
        </Surface>
    </StyledSafeAreaView>
}