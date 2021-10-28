import React, {useCallback, useMemo} from "react";
import {DrawerContentComponentProps} from "@react-navigation/drawer";
import {useTranslation} from "react-i18next";
import {Subtitle} from "./Subtitle";
import {Button} from "./Button";
import {makeStyle} from "../theming";
import {StyledSafeAreaView} from "./StyledSafeAreaView";
import {FlatList, Image, View, ListRenderItemInfo} from "react-native";
import {CachedDesmosProfile, ChainAccount} from "../types/chain";
import {IconButton} from "./IconButton";
import {ListItemSeparator, ProfileListItem} from "./index";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useDeleteAccount from "../hooks/useDeleteAccount";
import useShowModal from "../hooks/useShowModal";
import {TwoButtonModal} from "../modals/TwoButtonModal";
import useChangeAccount from "../hooks/useChangeAccount";
import useAccounts from "../hooks/useAccounts";
import useProfiles from "../hooks/useProfiles";

type AccountProfilePair = [ChainAccount, CachedDesmosProfile | null];

export const AppDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
    const {navigation} = props;
    const {t} = useTranslation();
    const styles = useStyle();
    const accounts = useAccounts();
    const profiles = useProfiles();
    const selectedAccount = useSelectedAccount();
    const changeAccount = useChangeAccount();
    const deleteAccount = useDeleteAccount();
    const showModal = useShowModal();

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
    }, [navigation]);

    const openSettings = useCallback(() => {
        console.warn("Settings screen not implemented")
    }, []);

    const onChangeAccount = useCallback((account: ChainAccount) => {
        if (account.address !== selectedAccount?.address) {
            changeAccount(account);
        }
        navigation.closeDrawer();
    }, [changeAccount, navigation, selectedAccount]);

    const onDeleteAccount = useCallback(async (pair: AccountProfilePair) => {
        const [account] = pair;
        const accounts = await deleteAccount(account);
        if (accounts.length === 0) {
            navigation.reset({
                index: 0,
                routes: [{
                    name: "AccountCreationScreens",
                    params: undefined,
                }],
            })
        } else {
            if (selectedAccount.address === account.address) {
                onChangeAccount(accounts[0]);
            }
        }
    }, [navigation, deleteAccount, onChangeAccount, selectedAccount]);

    const showDeleteModal = useCallback((pair: AccountProfilePair) => {
        showModal(TwoButtonModal, {
            title: t("remove account"),
            message: t("are you sure you want to remove this account"),
            positiveActionLabel: t("yes"),
            positiveAction: () => onDeleteAccount(pair),
            negativeActionLabel: t("cancel"),
        })
    }, [t, showModal, onDeleteAccount])

    const editProfile = useCallback((pair: AccountProfilePair) => {
        navigation.navigate({
            name: "EditProfile",
            params: {
                account: pair[0],
                profile: pair[1]
            }
        });
        navigation.closeDrawer();
    }, [navigation])

    const renderAccounts = useCallback(({item}: ListRenderItemInfo<AccountProfilePair>) => {
        const [account, profile] = item;
        return <ProfileListItem
            address={account.address}
            nickname={profile?.nickname}
            dtag={profile?.dtag}
            image={profile?.cachedProfilePictureUri ? {uri: profile.cachedProfilePictureUri} : undefined}
            onPress={() => onChangeAccount(item[0])}
            onEdit={() => editProfile(item)}
            onDelete={() => showDeleteModal(item)}
        />
    }, [onChangeAccount, editProfile, showDeleteModal]);

    return <StyledSafeAreaView>
        <IconButton
            style={styles.settingsBtn}
            icon="cog-outline"
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
        marginTop: 40,
        width: "100%",
        flex: 1
    },
    settingsBtn: {
        position: "absolute",
        top: 20,
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