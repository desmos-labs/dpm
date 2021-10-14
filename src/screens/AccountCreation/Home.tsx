import React, {useCallback} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {useTranslation} from "react-i18next";
import {Button, StyledSafeAreaView} from "../../components";
import {makeStyle} from "../../theming";
import {Image, View} from "react-native";
import {FlexPadding} from "../../components/FlexPadding";
import {IconButton} from "react-native-paper";


declare type Props = StackScreenProps<AccountCreationStackParams, "Home">

export default function Home({navigation}: Props): JSX.Element {
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
                style={styles.buttons}
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
        top: theme.spacing.s,
        left: 0,
    },
    brandContainer: {
        display: "flex",
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    icon: {
        flex: 2,
        alignSelf: "center"
    },
    typography: {
        flex: 1,
        marginTop: theme.spacing.m
    },
    buttonsContainer: {
        display: "flex",
        justifyContent: "flex-end"
    },
    buttons: {
        marginTop: theme.spacing.m
    }
}))