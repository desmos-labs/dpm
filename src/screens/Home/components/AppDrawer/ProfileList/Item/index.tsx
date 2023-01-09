import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import Typography from 'components/Typography';
import { Account } from 'types/account';
import { DesmosProfile } from 'types/desmosTypes';
import { useSetActiveAccountAddress } from '@recoil/activeAccountState';
import useDrawerContext from 'lib/AppDrawer/context';
import useStyles from './useStyles';
import ItemMenu from '../ItemMenu';

export type ProfileListItemProps = {
  readonly account: Account;
  readonly profile: DesmosProfile | null | undefined;
  readonly selected: boolean;
};

const ProfileListItem: React.FC<ProfileListItemProps> = ({ account, profile, selected }) => {
  const styles = useStyles();
  const { closeDrawer } = useDrawerContext();
  const setActiveAccountAddress = useSetActiveAccountAddress();

  const profileImage = useMemo(
    () =>
      profile?.profilePicture
        ? {
            uri: profile.profilePicture,
          }
        : require('assets/images/defaultProfilePicture.png'),
    [profile],
  );

  const onItemPres = useCallback(() => {
    setActiveAccountAddress(account.address);
    closeDrawer();
  }, [setActiveAccountAddress, account.address, closeDrawer]);

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
      {/* Menu that allows to delete or modify the account */}
      <ItemMenu account={account} />
    </TouchableOpacity>
  );
};

export default ProfileListItem;
