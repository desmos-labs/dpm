import React, {useState} from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import LabeledTextInput from "../../components/LabeledTextInput";


declare type Props = StackScreenProps<AccountCreationStackParams, "CreateWalletPassword">

export default function (props: Props): JSX.Element {

    const [password, setPassword] = useState("");
    const [isPasswordSafe, setPasswordSafe] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const onPasswordChange = (text: string) => {
        setPassword(text);
        setPasswordSafe(text.length > 8)
    }

    const onConfirmPasswordChange = (text: string) => {
        setConfirmPassword(text);
    }

    const onContinuePressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        if (isPasswordSafe && confirmPassword === password) {
            props.navigation.navigate({
                name: "GenerateAccountKeys",
                params: {
                    ...props.route.params,
                    password,
                }
            })
        }
    }

    return <SafeAreaView>
        <Text>Provide a password to protect your secret keys</Text>
        <LabeledTextInput label={"Password"} onChangeText={onPasswordChange}/>
        <LabeledTextInput label={"ConfirmPassword"} onChangeText={onConfirmPasswordChange}/>
        <Button title={"Continue"} onPress={onContinuePressed}/>
    </SafeAreaView>
}