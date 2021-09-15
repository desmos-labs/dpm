import React from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {useTranslation} from "react-i18next";


declare type Props = StackScreenProps<AccountCreationStackParams, "AccountCreation">

export default function AccountCreation({navigation}: Props): JSX.Element {

    const { t } = useTranslation();

    const onCreatePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: "GenerateNewMnemonic",
            params: undefined
        })
    }

    const onImportPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: "ImportAccount",
            params: undefined
        })
    }

    return <SafeAreaView>
        <Button title={t("createAccount")} onPress={onCreatePressed} />
        <Button title={t("importAccount")} onPress={onImportPressed} />
    </SafeAreaView>
}