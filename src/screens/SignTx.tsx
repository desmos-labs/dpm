import React, {useEffect, useState} from "react";
import {RootStackParams} from "../types/navigation";
import {Button, NativeSyntheticEvent, NativeTouchEvent, SafeAreaView, Text} from "react-native";
import LabeledTextInput from "../components/LabeledTextInput";
import useSignTx from "../hooks/useSignTx";
import {StackScreenProps} from "@react-navigation/stack";
import {DeferredState} from "../types/defered";

declare type Props = StackScreenProps<RootStackParams, "SignTx">;

export default function (props: Props): JSX.Element {

    const [password, setPassword] = useState("");
    const [signature, sign] = useSignTx();

    const onPasswordChanged = (text: string) => {
        setPassword(text);
    }

    const onSignPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        sign(props.route.params.address, props.route.params.tx, password);
    }

    useEffect(() => {
        if (signature?.state() === DeferredState.Completed) {
            props.route.params.onSigned(props.navigation, signature.value());
        }
    })

    if (signature === null) {
        return <SafeAreaView>
            <LabeledTextInput label={"Password"} onChangeText={onPasswordChanged}/>
            <Button title={"Sign"} onPress={onSignPressed}/>
        </SafeAreaView>
    } else {
        switch (signature.state()) {
            case DeferredState.Pending:
                return <SafeAreaView>
                    <Text>Signing...</Text>
                </SafeAreaView>
            case DeferredState.Failed:
                return <SafeAreaView>
                    <Text>{signature.error()}</Text>
                </SafeAreaView>
            case DeferredState.Completed:
                return <SafeAreaView>
                    <Text>Transaction signed successfully!</Text>
                </SafeAreaView>
        }
    }
}