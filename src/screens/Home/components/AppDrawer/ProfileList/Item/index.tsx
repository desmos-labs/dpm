import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Menu, useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import Divider from 'components/Divider';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { Account } from 'types/account';
import { DesmosProfile } from 'types/desmosTypes';
import { useSetActiveAccountAddress } from '@recoil/activeAccountState';
import useDrawerContext from 'lib/AppDrawer/context';
import useDeleteAccount from 'hooks/useDeleteAccount';
import MenuItem from '../../MenuItem';
import useStyles from './useStyles';

export type ProfileListItemProps = {
  readonly account: Account;
  readonly profile: DesmosProfile | null | undefined;
  readonly selected: boolean;
};

const ProfileListItem: React.FC<ProfileListItemProps> = ({ account, profile, selected }) => {
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useStyles();
  const { closeDrawer } = useDrawerContext();
  const [menuVisible, setMenuVisible] = useState(false);
  const setActiveAccountAddress = useSetActiveAccountAddress();
  const deleteAccount = useDeleteAccount();

  const profileImage = useMemo(
    () =>
      profile?.profilePicture
        ? {
            uri: profile.profilePicture,
          }
        : require('assets/images/defaultProfilePicture.png'),
    [profile],
  );

  const onMenuOpen = useCallback(() => {
    setMenuVisible(true);
  }, []);

  const onMenuDismiss = useCallback(() => {
    setMenuVisible(false);
  }, []);

  const onItemPres = useCallback(() => {
    setActiveAccountAddress(account.address);
    closeDrawer();
  }, [setActiveAccountAddress, account.address, closeDrawer]);

  const onDeleteAccount = useCallback(() => {
    deleteAccount(account.address);
    setMenuVisible(false);
    closeDrawer();
  }, [account.address, closeDrawer, deleteAccount]);

  const onEditProfile = useCallback(() => {
    setMenuVisible(false);
    closeDrawer();
    // TODO: Implement functionality
    console.warn('implement edit account');
  }, [closeDrawer]);

  return (
    <TouchableOpacity
      style={[styles.root, selected ? styles.itemSelected : null]}
      onPress={onItemPres}
    >
      <AvatarImage source={profileImage} size={48} />
      <View style={styles.textContainer}>
        <Typography.Subtitle style={styles.nickname} numberOfLines={1} ellipsizeMode="tail">
          {profile?.nickname ?? '-'}
        </Typography.Subtitle>
        <Typography.Body style={styles.dtag} ellipsizeMode="middle" numberOfLines={1}>
          {profile?.dtag !== undefined ? `@${profile.dtag}` : account.address}
        </Typography.Body>
      </View>
      {
        <Menu
          visible={menuVisible}
          onDismiss={onMenuDismiss}
          anchor={
            <IconButton icon="more" onPress={onMenuOpen} size={22} color={theme.colors.icon['3']} />
          }
        >
          <MenuItem icon="edit" text={t('edit profile')} onPress={onEditProfile} />
          <Divider style={styles.menuDivider} />
          <MenuItem icon="delete" text={t('delete account')} onPress={onDeleteAccount} />
        </Menu>
      }
    </TouchableOpacity>
  );
};

export default ProfileListItem;
