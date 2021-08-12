import React, {useState} from "react";
import {Button, NativeSyntheticEvent, SafeAreaView, Text, TextInput} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {checkMnemonic} from "../../wallet/LocalWallet";
import LabeledTextInput from "../../components/LabeledTextInput";


declare type Props = StackScreenProps<AccountCreationStackParams, "ImportAccount">;

export default function ImportAccount(props: Props): JSX.Element {

    const [accountName, setAccountName] = useState("New Account");
    const [userMnemonic, setMnemonic] = useState("");
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onTextChange = (text: string) => {
        setMnemonic(text);
    }

    const onRecoverPressed = (_: NativeSyntheticEvent<TouchEvent>) => {
        if (checkMnemonic(userMnemonic)) {
            props.navigation.navigate({
                name: "CreateWalletPassword",
                params: {
                    mnemonic: userMnemonic,
                    name: accountName,
                    password: "",
                    account: 0,
                    index: 0,
                }
            })
        } else {
            setErrorMessage("Invalid recovery passphrase")
        }
    }

    return <SafeAreaView>
        <LabeledTextInput label={"Account name"} onChangeText={setAccountName} textProps={{value: accountName}}/>
        <Text>Please insert the recovery passphrase</Text>
        <TextInput multiline={true} onChangeText={onTextChange} value={userMnemonic}/>
        {errorMessage !== null && <Text>{errorMessage}</Text>}
        <Button title={"Recover"} onPress={onRecoverPressed}/>
    </SafeAreaView>
}