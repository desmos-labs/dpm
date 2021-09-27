import React, {useState} from "react";
import {View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {StyledSafeAreaView, Button, Title, Subtitle, Paragraph, PasswordComplexity} from "../../components";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {SecureTextInput} from "../../components/SecureTextInput";
import {PasswordComplexityScore} from "../../components/PasswordComplexityScore";

function evaluatePasswordComplexity(password: string): PasswordComplexityScore {
    const specialChars = "\\|!\"£$%&/()=?^'[]*+@#{}<>";
    if (password.length < 6) {
        return 0;
    }
    let uppercaseChars = 0;
    let numberChars = 0;
    let specialCharsCount = 0;

    for (let i = 0; i < password.length; i++) {
        if (!isNaN(Number(password[i]))) {
            numberChars++;
        }
        else if (specialChars.indexOf(password[i]) >= 0) {
            specialCharsCount++;
        }
        else if (password[i].toUpperCase() === password[i]) {
            uppercaseChars++;
        }
    }

    let score = 1;
    if (uppercaseChars > 0) {
        score++;
    }
    if (numberChars > 0) {
        score++;
    }
    if (specialCharsCount > 0) {
        score++;
    }

    return score as PasswordComplexityScore;
}

type CreatePasswordProps = StackScreenProps<AccountCreationStackParams, "CreateWalletPassword">
type CheckPasswordProps = StackScreenProps<AccountCreationStackParams, "CheckWalletPassword">
type Props = CreatePasswordProps | CheckPasswordProps;

export default function WalletPassword(props: Props): JSX.Element {

    const {t} = useTranslation();
    const styles = useStyles();
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    // @ts-ignore
    const isCreatePassword = props.route.params.password === undefined;

    const onPasswordChange = (text: string) => {
        setPassword(text);
        setErrorMessage(null);
    }

    const onContinuePressed = () => {
        if (isCreatePassword) {
            if (evaluatePasswordComplexity(password) === 0) {
                setErrorMessage(t("password too short"));
                return;
            }
            props.navigation.navigate({
                name: "CheckWalletPassword",
                params: {
                    ...props.route.params,
                    password: password,
                }
            })
        } else {
            // @ts-ignore
            if (password !== props.route.params?.password) {
                setErrorMessage(t("confirmation password don't match"));
            } else {
                props.navigation.navigate({
                    name: "GenerateAccount",
                    params: {
                        wallet: props.route.params.wallet,
                        password: password,
                    }
                })
            }
        }
    }

    return <StyledSafeAreaView>
        <Title>
            {t("protect your wallet")}
        </Title>
        <Subtitle>
            {t("add an extra layer of security to keep your tokens safe")}
        </Subtitle>

        <View style={styles.passwordLabel}>
            <Paragraph capitalize>
                {isCreatePassword ?
                    t("enter security password") :
                    t("confirm security password")
                }
            </Paragraph>

            {isCreatePassword && <PasswordComplexity score={evaluatePasswordComplexity(password)}/>}
        </View>
        <SecureTextInput
            placeholder={t("password")}
            style={styles.password}
            value={password}
            onChangeText={onPasswordChange}
        />
        {isCreatePassword && <Paragraph style={styles.passwordComplexityHint}>
            {t("password complexity hint")}.
        </Paragraph> }
        <Paragraph
            style={styles.errorParagraph}
        >
            {errorMessage}
        </Paragraph>
        <Button
            style={styles.continueButton}
            mode="contained"
            onPress={onContinuePressed}
        >
            {isCreatePassword ? t("next") : t("confirm")}
        </Button>
    </StyledSafeAreaView>
}

const useStyles = makeStyle(theme => ({
    passwordLabel: {
        display: "flex",
        flexDirection: "row",
        marginTop: theme.spacing.m,
        alignItems: "center",
        justifyContent: "space-between"
    },
    password: {
        marginTop: theme.spacing.s,
    },
    passwordComplexityHint: {
        marginTop: theme.spacing.s,
    },
    continueButton: {
        marginTop: theme.spacing.s,
    },
    errorParagraph: {
        color: theme.colors.error,
        marginTop: theme.spacing.s,
        flexGrow: 1
    }
}));