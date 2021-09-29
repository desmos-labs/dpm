import React from "react";
import {FlatList} from "react-native";
import {useRecoilValue, useSetRecoilState} from "recoil";
import AccountStore from "../store/AccountStore";
import {ChainAccount} from "../types/chain";
import useSaveSelectedAccount from "../hooks/useSaveSelectedAccount";
import {List, Title} from "react-native-paper";
import {StyledSafeAreaView} from "../components";
import {useTranslation} from "react-i18next";
import {cropAddress} from "../utilils/address";

export default function Accounts(): JSX.Element {
    const {t} = useTranslation();
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const saveSelectedAccount = useSaveSelectedAccount();
    const setSelectedAccount = useSetRecoilState(AccountStore.selectedAccount);

    const onAccountPressed = (account: ChainAccount) => {
        saveSelectedAccount(account);
        setSelectedAccount(account);
    }

    return <StyledSafeAreaView>
        <Title>
            {t("accounts")}
        </Title>
        <FlatList data={accounts} renderItem={({item}) =>
            <List.Item
                key={item.address}
                title={item.name}
                description={cropAddress(item.address, 12)}
                onPress={() => onAccountPressed(item)}/>}/>
    </StyledSafeAreaView>;
}