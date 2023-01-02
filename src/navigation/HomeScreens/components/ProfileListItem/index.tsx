import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity, View } from 'react-native';
import { Source } from 'react-native-fast-image';
import { Menu, useTheme } from 'react-native-paper';
import AvatarImage from 'components/AvatarImage';
import Divider from 'components/Divider';
import IconButton from 'components/IconButton';
import Typography from 'components/Typography';
import { MenuItem } from '../MenuItem';
import useStyles from './useStyles';

export type ProfileListItemProps = {
  /**
   * The account bech32 address.
   */
  address: string;
  /**
   * The user's profile picture.
   */
  image?: Source;
  /**
   * The user's profile nickname.
   */
  nickname?: string;
  /**
   * The user's profile dtag.
   */
  dtag?: string;
  /**
   * True if the item is the selected one.
   */
  isItemSelected: boolean;
  /**
   * Function called when the user press the item.
   */
  onPress?: () => void;
  /**
   * Callback called if the user want to edit the profile.
   */
  onEdit?: () => void;
  /**
   * Callback called if the user want to delete the account.
   */
  onDelete?: () => void;
};

const ProfileListItem: React.FC<ProfileListItemProps> = (props) => {
  const { address, image, nickname, dtag, isItemSelected, onPress, onEdit, onDelete } = props;
  const theme = useTheme();
  const { t } = useTranslation();
  const styles = useStyles();
  const [menuVisible, setMenuVisible] = useState(false);

  const showMenu = useMemo(
    () => onEdit !== undefined || onDelete !== undefined,
    [onEdit, onDelete],
  );

  const onMenuOpen = () => {
    setMenuVisible(true);
  };

  const onMenuDismiss = () => {
    setMenuVisible(false);
  };

  return (
    <TouchableOpacity style={[styles.root, isItemSelected ? styles.itemSelected : null]} onPress={onPress}>
      <AvatarImage source={image ?? require('assets/images/defaultProfilePicture.png')} size={48} />
      <View style={styles.textContainer}>
        <Typography.Subtitle style={styles.nickname} numberOfLines={1} ellipsizeMode="tail">
          {nickname ?? '-'}
        </Typography.Subtitle>
        <Typography.Body style={styles.dtag} ellipsizeMode="middle" numberOfLines={1}>
          {dtag !== undefined ? `@${dtag}` : address}
        </Typography.Body>
      </View>
      {showMenu && (
        <Menu
          visible={menuVisible}
          onDismiss={onMenuDismiss}
          anchor={
            <IconButton icon="more" onPress={onMenuOpen} size={22} color={theme.colors.icon['3']} />
          }
        >
          {onEdit && (
            <MenuItem
              icon="edit"
              text={t('edit profile')}
              onPress={() => {
                setMenuVisible(false);
                onEdit!();
              }}
            />
          )}
          {onEdit && onDelete && <Divider style={styles.menuDivider} />}
          {onDelete && (
            <MenuItem
              icon="delete"
              text={t('delete account')}
              onPress={() => {
                setMenuVisible(false);
                onDelete!();
              }}
            />
          )}
        </Menu>
      )}
    </TouchableOpacity>
  );
};

export default ProfileListItem;
