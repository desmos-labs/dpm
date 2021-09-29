import React, {useCallback} from "react";
import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {useTranslation} from "react-i18next";
import {Subtitle} from "./Subtitle";
import Button from "./Button";
import {makeStyle} from "../theming";
import StyledSafeAreaView from "./StyledSafeAreaView";
import {FlatList, Image, View, ListRenderItemInfo} from "react-native";
import {useRecoilValue} from "recoil";
import AccountStore from "../store/AccountStore";
import ChainAccount from "../types/chainAccount";
import useSaveSelectedAccount from "../hooks/useSaveSelectedAccount";
import {IconButton} from "react-native-paper";
import useSelectedAccount from "../hooks/useSelectedAccount";
import {ListItemSeparator, ProfileListItem} from "./index";

export const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation();
    const styles = useStyle();
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const selectedAccount = useSelectedAccount();
    const saveSelectedAccount = useSaveSelectedAccount()

    const addAccount = useCallback(() => {
        navigation.closeDrawer();
        navigation.navigate({
            name: "AccountCreationScreens",
            params: undefined
        })
    }, [navigation])

    const openSettings = useCallback(() => {
        console.warn("Settings screen not implemented")
    }, [])

    const changeAccount = useCallback((account: ChainAccount) => {
        if (account.address !== selectedAccount?.address) {
            saveSelectedAccount(account, true);
            navigation.navigate({
                name: "AccountScreen",
                params: {
                    account,
                }
            })
        } else {
            navigation.closeDrawer();
        }
    }, [saveSelectedAccount, navigation, selectedAccount]);

    const renderAccounts = useCallback(({item}: ListRenderItemInfo<ChainAccount>) => (
        // TODO: Populate the item with the values cached from the chain...
        <ProfileListItem
            address={item.address}
            onPress={() => changeAccount(item)}
        />
    ), [changeAccount]);

    return <StyledSafeAreaView>
        <IconButton
            style={styles.settingsBtn}
            icon="cog-outline"
            size={20}
            onPress={openSettings}
        />
        <Image
            style={styles.desmosIcon}
            source={require("../assets/desmos-vertical-orange.png")}
            resizeMode="contain"
        />

        <View style={styles.accountsContainer}>
            <Subtitle>
                {t("accounts")}
            </Subtitle>

            <FlatList
                style={styles.accountsList}
                data={accounts}
                keyExtractor={i => i.address}
                renderItem={renderAccounts}
                ItemSeparatorComponent={ListItemSeparator}
            />
        </View>

        <Button mode="outlined" onPress={addAccount}>
            {t("add account")}
        </Button>
    </StyledSafeAreaView>
}

const useStyle = makeStyle(theme => ({
    desmosIcon: {
        marginTop: 20,
        width: "100%",
        flex: 1
    },
    settingsBtn: {
        position: "absolute",
        top: 0,
        right: 0,
    },
    accountsContainer: {
        marginTop: 64,
        flex: 8,
    },
    accountsList: {
        marginTop: theme.spacing.m,
    },
}))