import React, {useCallback, useMemo} from "react";
import {useTranslation} from "react-i18next";
import {Button} from "./Button";
import {makeStyle} from "../theming";
import {StyledSafeAreaView} from "./StyledSafeAreaView";
import {FlatList, Image, View, ListRenderItemInfo} from "react-native";
import {CachedDesmosProfile, ChainAccount} from "../types/chain";
import {ListItemSeparator, ProfileListItem, Typography} from "./index";
import useSelectedAccount from "../hooks/useSelectedAccount";
import useDeleteAccount from "../hooks/useDeleteAccount";
import useShowModal from "../hooks/useShowModal";
import {TwoButtonModal} from "../modals/TwoButtonModal";
import useChangeAccount from "../hooks/useChangeAccount";
import useAccounts from "../hooks/useAccounts";
import useProfiles from "../hooks/useProfiles";
import {CompositeNavigationProp} from "@react-navigation/native";
import {StackNavigationProp} from "@react-navigation/stack/lib/typescript/src/types";
import {AccountScreensStackParams, RootStackParams} from "../types/navigation";
import {useDrawerContext} from "../contexts/AppDrawerContex";


type AccountProfilePair = [ChainAccount, CachedDesmosProfile | null];

export type Props = {
    navigation: CompositeNavigationProp<
        StackNavigationProp<AccountScreensStackParams, "HomeScreens">,
        StackNavigationProp<RootStackParams>
        >
}

export const AppDrawerContent: React.FC<Props> = (props) => {
    const {navigation} = props;
    const {closeDrawer} = useDrawerContext();
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
        closeDrawer();
        navigation.navigate({
            name: "AccountCreationScreens",
            params: undefined
        })
    }, [navigation, closeDrawer]);

    const onChangeAccount = useCallback((account: ChainAccount) => {
        if (account.address !== selectedAccount?.address) {
            changeAccount(account);
        }
        closeDrawer();
    }, [closeDrawer, changeAccount, selectedAccount]);

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
        closeDrawer()
    }, [closeDrawer, navigation])

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
        <Image
            style={styles.desmosIcon}
            source={require("../assets/desmos-vertical-orange.png")}
            resizeMode="contain"
        />

        <View style={styles.accountsContainer}>
            <Typography.Subtitle>
                {t("accounts")}
            </Typography.Subtitle>

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