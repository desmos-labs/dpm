import React from "react";
import {FlatList, StyleSheet} from "react-native";
import {useRecoilValue, useSetRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import ChainAccount from "../types/chainAccount";
import useSaveSelectedAccount from "../hooks/useSaveSelectedAccount";
import {List} from "react-native-paper";
import {StyledSafeAreaView} from "../components";

export default function Accounts(): JSX.Element {
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const saveSelectedAccount = useSaveSelectedAccount();
    const setSelectedAccount = useSetRecoilState(AccountStore.selectedAccount);

    const onAccountPressed = (account: ChainAccount) => {
        saveSelectedAccount(account);
        setSelectedAccount(account);
    }

    return <StyledSafeAreaView>
        <FlatList data={accounts} renderItem={({item}) =>
            <List.Item
                key={item.address}
                title={item.name}
                description={item.address}
                onPress={() => onAccountPressed(item)}/>}/>
    </StyledSafeAreaView>;
}