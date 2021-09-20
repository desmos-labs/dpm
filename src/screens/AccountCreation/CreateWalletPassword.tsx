import React, {useState} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {StyledSafeAreaView, Button} from "../../components";
import {Paragraph, ProgressBar, Subheading} from "react-native-paper";
import {useTranslation} from "react-i18next";
import {makeStyle} from "../../theming";
import {SecureTextInput} from "../../components/SecureTextInput";

const useClasses = makeStyle(theme => ({
    password: {
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

function evaluatePasswordComplexity(password: string): number {
    const specialChars = "\\|!\"£$%&/()=?^'[]*+@#{}<>";
    if (password.length < 8) {
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

    return score / 4;
}

declare type Props = StackScreenProps<AccountCreationStackParams, "CreateWalletPassword">

export default function (props: Props): JSX.Element {

    const {t} = useTranslation();
    const classes = useClasses();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onPasswordChange = (text: string) => {
        setPasswordError(false);
        setPassword(text);
    }

    const onConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
        setConfirmPasswordError(false);
    }

    const onContinuePressed = () => {
        if (evaluatePasswordComplexity(password) === 0) {
            setPasswordError(true);
            setErrorMessage(t("password must be longer than 8 chars"))
            return;
        }
        if (confirmPassword !== password) {
            setConfirmPasswordError(true);
            setErrorMessage(t("password doesn't match"))
            return;
        }
        props.navigation.navigate({
            name: "GenerateAccountKeys",
            params: {
                ...props.route.params,
                password,
            }
        })
    }

    const passwordScore = evaluatePasswordComplexity(password);
    let scoreColor = "#ff3d00";
    if (passwordScore >= 0.75) {
        scoreColor = "#43a047"
    } else if (passwordScore >= 0.5) {
        scoreColor = "#fdd835"
    }

    return <StyledSafeAreaView>
        <Subheading>
            {t("provide a password to protect your account")}
        </Subheading>
        <SecureTextInput
            label={t("password")}
            style={classes.password}
            value={password}
            error={passwordError}
            onChangeText={onPasswordChange}
        />
        <ProgressBar
            progress={passwordScore}
            color={scoreColor}
        />
        <SecureTextInput
            label={t("confirm password")}
            style={classes.password}
            value={confirmPassword}
            onChangeText={onConfirmPasswordChange}
            error={confirmPasswordError}
        />
        <Paragraph
            style={classes.errorParagraph}
        >
            {errorMessage}
        </Paragraph>
        <Button
            style={classes.continueButton}
            mode="contained"
            onPress={onContinuePressed}
        >
            {t("continue")}
        </Button>
    </StyledSafeAreaView>
}