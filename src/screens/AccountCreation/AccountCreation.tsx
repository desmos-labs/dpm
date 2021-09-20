import React from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {useTranslation} from "react-i18next";
import {Paragraph} from "react-native-paper";
import {Button, StyledSafeAreaView} from "../../components";
import {makeStyle} from "../../theming";


declare type Props = StackScreenProps<AccountCreationStackParams, "AccountCreation">

const useClasses = makeStyle(theme => ({
    title: {
        textAlign: "center"
    },
    welcome: {
        marginTop: theme.spacing.l,
        flexGrow: 1,
    },
    buttons: {
        marginTop: theme.spacing.s
    }
}))

export default function AccountCreation({navigation}: Props): JSX.Element {
    const {t} = useTranslation();
    const classes = useClasses();

    const onCreatePressed = () => {
        navigation.navigate({
            name: "GenerateNewMnemonic",
            params: undefined
        })
    }

    const onImportPressed = () => {
        navigation.navigate({
            name: "ImportAccount",
            params: undefined
        })
    }

    return <StyledSafeAreaView>
        <Paragraph style={classes.welcome}>
            {t("welcome to dpm")}
        </Paragraph>
        <Button
            style={classes.buttons}
            mode="contained"
            onPress={onCreatePressed}
        >
            {t("create account")}
        </Button>
        <Button
            style={classes.buttons}
            mode="outlined"
            onPress={onImportPressed}
        >
            {t("import account")}
        </Button>
    </StyledSafeAreaView>
}