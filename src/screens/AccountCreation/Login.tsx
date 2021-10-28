import React, {useCallback} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {useTranslation} from "react-i18next";
import {Button, StyledSafeAreaView, IconButton} from "../../components";
import {makeStyle} from "../../theming";
import {Image, View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";


declare type Props = StackScreenProps<AccountCreationStackParams, "Login">

export default function Login({navigation}: Props): JSX.Element {
    const {t} = useTranslation();
    const styles = useStyle();

    const onCreatePressed = useCallback(() => {
        navigation.navigate({
            name: "GenerateNewMnemonic",
            params: undefined
        })
    }, [navigation]);

    const onImportPressed = useCallback(() => {
        navigation.navigate({
            name: "ImportRecoveryPassphrase",
            params: undefined
        })
    }, [navigation]);

    const goBack = useCallback(() => {
        navigation.goBack();
    }, [navigation])

    return <StyledSafeAreaView>
        {navigation.canGoBack() ? (
            <IconButton
                style={styles.backArrow}
                icon="arrow-left"
                onPress={goBack}
            />): null}
        <FlexPadding flex={1} />
        <Image
            style={styles.icon}
            source={require("../../assets/desmos-vertical-orange.png")}
            resizeMode="contain"
        />
        <FlexPadding flex={7} />
        <View style={styles.buttonsContainer}>
            <Button
                style={styles.buttons}
                mode="contained"
                onPress={onCreatePressed}
            >
                {t("create wallet")}
            </Button>
            <Button
                style={[styles.buttons, styles.buttonMargin]}
                mode="outlined"
                onPress={onImportPressed}
            >
                {t("import recovery passphrase")}
            </Button>
        </View>
    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    backArrow: {
        position: "absolute",
        top: 40,
        left: 0,
        zIndex: 1,
    },
    brandContainer: {
        display: "flex",
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        flex: 2.2,
        alignSelf: "center"
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "flex-end"
    },
    buttons: {
        justifyContent: "center"
    },
    buttonMargin: {
        marginTop: theme.spacing.l,
    }
}))