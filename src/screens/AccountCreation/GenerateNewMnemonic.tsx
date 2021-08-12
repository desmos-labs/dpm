import React, {useState} from "react";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {AccountCreationStackParams} from "../../types/navigation";
import {randomMnemonic} from "../../wallet/LocalWallet";
import LabeledTextInput from "../../components/LabeledTextInput";

declare type Props = StackScreenProps<AccountCreationStackParams, "GenerateNewMnemonic">;

export default function GenerateNewMnemonic(props: Props): JSX.Element {

    const [accountName, setAccountName] = useState("New account");
    const [newMnemonic, ] = useState(randomMnemonic());
    const {navigation} = props;

    const onOkPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigation.navigate({
            name: "CheckMnemonic",
            params: {
                mnemonic: newMnemonic,
                name: accountName,
                password: "",
                account: 0,
                index: 0
            }
        });
    }

    return <SafeAreaView>
        <LabeledTextInput label={"Account name"} onChangeText={setAccountName} textProps={{value: accountName}}/>
        <Text>Recovery passphrase:</Text>
        <Text selectable={true}>{newMnemonic}</Text>
        <Text>Please save the recovery passphrase in a safe place.</Text>
        <Text>This will be the only way to recover your account!!</Text>
        <Button title={"Ok"} onPress={onOkPressed}/>
    </SafeAreaView>
}