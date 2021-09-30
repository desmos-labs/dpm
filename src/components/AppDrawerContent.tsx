import React, {useCallback, useMemo} from "react";
import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {useTranslation} from "react-i18next";
import {Subtitle} from "./Subtitle";
import Button from "./Button";
import {makeStyle} from "../theming";
import StyledSafeAreaView from "./StyledSafeAreaView";
import {FlatList, Image, View, ListRenderItemInfo} from "react-native";
import {useRecoilValue} from "recoil";
import AccountStore from "../store/AccountStore";
import {CachedDesmosProfile, ChainAccount} from "../types/chain";
import {IconButton} from "react-native-paper";
import {ListItemSeparator, ProfileListItem} from "./index";
import ChainStore from "../store/ChainStore";
import useSaveSelectedAccount from "../hooks/useSaveSelectedAccount";
import useSelectedAccount from "../hooks/useSelectedAccount";

type AccountProfilePair = [ChainAccount, CachedDesmosProfile | null];

export const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation();
    const styles = useStyle();
    const accounts = useRecoilValue(AccountStore.chainAccounts);
    const profiles = useRecoilValue(ChainStore.profiles);
    const selectedAccount = useSelectedAccount();
    const saveSelectedAccount = useSaveSelectedAccount();

    const accountProfilePair: AccountProfilePair[] = useMemo(() => {
        return accounts.map(a => {
            const profile = profiles[a.address] ?? null;
            return [a, profile];
        })
    }, [accounts, profiles])

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

    const onChangeAccount = useCallback((pair: AccountProfilePair) => {
        const [account] = pair;
        if (account.address !== selectedAccount?.address) {
            saveSelectedAccount(account, true);
            navigation.reset({
                index: 0,
                routes: [{
                    name: "AccountScreen",
                    params: {
                        account,
                    }
                }],
            })
        } else {
            navigation.closeDrawer();
        }
    }, [saveSelectedAccount, navigation, selectedAccount]);

    const renderAccounts = useCallback(({item}: ListRenderItemInfo<AccountProfilePair>) => {
        const [account, profile] = item;
        return <ProfileListItem
            address={account.address}
            nickname={profile?.nickname}
            dtag={profile?.dtag}
            image={profile?.cachedProfilePictureUri ? {uri: profile.cachedProfilePictureUri} : undefined}
            onPress={() => onChangeAccount(item)}
        />
    }, [onChangeAccount]);

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
                data={accountProfilePair}
                keyExtractor={i => i[0].address}
                renderItem={renderAccounts}
                ItemSeparatorComponent={ListItemSeparator}
            />
        </View>

        <Button
            style={styles.addAccountBtn}
            mode="outlined"
            onPress={addAccount}
        >
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
    addAccountBtn: {
        marginTop: theme.spacing.s,
    }
}))