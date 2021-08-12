import React from "react";
import {Text, TextInput, TextInputProps, View} from "react-native";

interface Props {
    label: string
    onChangeText?: (text: string) => void
    textProps?: Omit<TextInputProps, "onChangeText">
}

export default function (props: Props) {
    return <View>
        <Text>{props.label}</Text>
        <TextInput {...props.textProps} onChangeText={props.onChangeText}/>
    </View>
}