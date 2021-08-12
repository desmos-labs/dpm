import React from "react";
import {
    Button,
    FlatList,
    NativeSyntheticEvent,
    NativeTouchEvent,
    SafeAreaView,
    StyleSheet,
} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {RootStackParams} from "../types/navigation";
import {useRecoilValue} from "recoil";
import WalletConnectStore from "../store/WalletConnectStore";
import SettledSession from "../components/SettledSession";

type Props = StackScreenProps<RootStackParams, "AccountSessions">;

export default function AccountSessions(props: Props): JSX.Element {
    const {account} = props.route.params;
    const navigator = props.navigation;
    const sessions = useRecoilValue(WalletConnectStore.settledSessions);
    const accountAddress = `desmos:${account.chainId}:${account.address}`;

    const accountSessions = sessions.filter(
        (s) => s.state.accounts.indexOf(accountAddress) >= 0
    );

    const onNewSessionPressed = (_: NativeSyntheticEvent<NativeTouchEvent>) => {
        navigator.navigate({
            name: "NewWalletSession",
            params: {
                account,
            },
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                style={styles.list}
                data={accountSessions}
                renderItem={({item}) => <SettledSession session={item}/>}
            />
            <Button title={"New Session"} onPress={onNewSessionPressed}/>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 10,
    },
    list: {
        display: "flex",
        flexDirection: "column",
        flex: 1,
    },
});
