import { Account } from 'types/account';
import React, { FC, useCallback, useState } from 'react';
import IconButton from 'components/IconButton';
import MenuItem from 'screens/Home/components/AppDrawer/MenuItem';
import Divider from 'components/Divider';
import { Menu, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import useDrawerContext from 'lib/AppDrawer/context';
import useDeleteAccount from 'hooks/useDeleteAccount';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useGetProfiles } from '@recoil/profiles';
import useStyles from './useStyles';

export interface ItemMenuProps {
  readonly account: Account;
}

const ItemMenu: FC<ItemMenuProps> = ({ account }) => {
  const { t } = useTranslation();
  const navigator = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const theme = useTheme();
  const styles = useStyles();
  const [menuVisible, setMenuVisible] = useState(false);
  const { closeDrawer } = useDrawerContext();
  const deleteAccount = useDeleteAccount();
  const profiles = useGetProfiles();

  const onMenuOpen = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const onMenuDismiss = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const onDeleteAccount = useCallback(() => {
    deleteAccount(account.address);
    setMenuVisible(false);
    closeDrawer();
  }, [account.address, closeDrawer, deleteAccount]);

  const onEditProfile = useCallback(() => {
    setMenuVisible(false);
    closeDrawer();
    navigator.navigate(ROUTES.EDIT_PROFILE, {
      profile: profiles[account.address],
    });
  }, [closeDrawer, navigator, profiles, account.address]);

  return (
    <Menu
      visible={menuVisible}
      onDismiss={onMenuDismiss}
      anchor={
        <IconButton icon="more" onPress={onMenuOpen} size={22} color={theme.colors.icon['3']} />
      }
    >
      <MenuItem icon="edit" text={t('profile:edit profile')} onPress={onEditProfile} />
      <Divider style={styles.menuDivider} />
      <MenuItem icon="delete" text={t('delete account')} onPress={onDeleteAccount} />
    </Menu>
  );
};

export default ItemMenu;
