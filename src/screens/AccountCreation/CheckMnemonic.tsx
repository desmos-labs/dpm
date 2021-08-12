import React, {useState} from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import LabeledTextInput from "../../components/LabeledTextInput";


declare type Props = StackScreenProps<AccountCreationStackParams, "CheckMnemonic">;

export default function CheckMnemonic(props: Props): JSX.Element {

    const receivedMnemonic = props.route.params.mnemonic;
    const [userMnemonic, setUserMnemonic] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onTextChanged = (text: string) => {
        setUserMnemonic(text);
    }

    const onCheckPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        if (receivedMnemonic === userMnemonic) {
            props.navigation.navigate({
                name: "CreateWalletPassword",
                params: {
                    ...props.route.params,
                    mnemonic: userMnemonic,
                }
            });
        } else {
            setErrorMessage("Invalid recovery passphrase!");
        }
    }

    return <SafeAreaView>
        <Text>Before continue please provide the recovery passphrase to make sure that you have store it
            correctly</Text>
        <LabeledTextInput label={"Recovery passphrase"} onChangeText={onTextChanged} textProps={{multiline: true}}/>
        {errorMessage !== null && <Text>{errorMessage}</Text>}
        <Button title={"Check"} onPress={onCheckPressed}/>
    </SafeAreaView>
}