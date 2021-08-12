import React from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";


declare type Props = StackScreenProps<AccountCreationStackParams, "AccountCreation">

export default function AccountCreation(props: Props): JSX.Element {

    const {navigation} = props

    const onCreatePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: "GenerateNewMnemonic",
            params: undefined
        })
    }

    const onRecoverPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: "ImportAccount",
            params: undefined
        })
    }

    return <SafeAreaView>
        <Button title={"Create account"} onPress={onCreatePressed} />
        <Button title={"Recover account"} onPress={onRecoverPressed} />
    </SafeAreaView>
}