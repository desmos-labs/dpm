import React from "react";
import {Text, SafeAreaView} from "react-native";
import {RootStackParams} from "../types/navigation";
import {StackScreenProps} from "@react-navigation/stack";

type Props = StackScreenProps<RootStackParams, "NewWalletSession">;

export default function NewWalletSession(props: Props) {

    const account = props.route.params.account;

    return <SafeAreaView>
        <Text>Just some simple text</Text>
        <Text>Account: {account.address}</Text>
    </SafeAreaView>
}
