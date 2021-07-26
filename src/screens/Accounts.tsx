import React from "react";
import {FlatList, SafeAreaView, StyleSheet, Text, View} from "react-native";
import AccountCard from "../components/AccountCard";
import {useRecoilValue} from "recoil";
import AccountStore from "../store/AccountStore";
import ChainAccount from "../types/chainAccount";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";

type Props = StackScreenProps<RootStackParams, "Accounts">;

export default function Accounts(props: Props): JSX.Element {
    const accounts = useRecoilValue(AccountStore.chainAccounts);

    const onCardPressed = (account: ChainAccount) => {
        props.navigation.navigate("AccountSessions", { account });
    }

    return <SafeAreaView style={styles.container}>
        <FlatList data={accounts} renderItem={({item}) =>
            <AccountCard key={item.address} account={item} onPress={onCardPressed}/>}/>
    </SafeAreaView>;
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 8
    }
})