import ListItemSeparator from 'components/ListItemSeparator';
import { FlatList, ListRenderItemInfo } from 'react-native';
import React, { useCallback, useMemo } from 'react';
import { useGetAccounts } from '@recoil/accounts';
import { useGetProfiles } from '@recoil/profiles';
import { useActiveAccount } from '@recoil/activeAccount';
import { Account } from 'types/account';
import useStyles from './useStyles';
import ProfileListItem from './Item';

export const ProfileList = () => {
  const accounts = useGetAccounts();
  const profiles = useGetProfiles();
  const activeAccount = useActiveAccount();
  const styles = useStyles();

  const accountList = useMemo(() => Object.values(accounts), [accounts]);

  const renderAccounts = useCallback(
    (item: ListRenderItemInfo<Account>) => {
      const account = item.item;
      const profile = profiles[account.address];
      const isItemSelected = account.address === activeAccount?.address;
      return <ProfileListItem account={account} profile={profile} selected={isItemSelected} />;
    },
    [activeAccount?.address, profiles],
  );
  return (
    <FlatList
      style={styles.accountsList}
      data={accountList}
      keyExtractor={(account) => account.address}
      renderItem={renderAccounts}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
};
