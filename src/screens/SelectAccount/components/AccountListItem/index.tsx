import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import ProfileImage from 'components/ProfileImage';
import Spacer from 'components/Spacer';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { DesmosProfile } from 'types/desmos';
import useStyles from './useStyles';

export type AccountListItemProps = {
  /**
   * The Bech32 address that is displayed to the user.
   */
  address: string;
  profile: DesmosProfile | undefined;
  /**
   * True if the item should be highlighted to the user.
   */
  highlight?: boolean;
  /**
   * Function called when the user click over the item.
   */
  onPress?: () => void;
};

const AccountListItem = (props: AccountListItemProps) => {
  const { address, highlight, onPress, profile } = props;
  const styles = useStyles(highlight);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <View style={styles.row}>
        {/* <Typography.Body1 style={styles.number}>#{number}</Typography.Body1> */}

        {/* Profile image */}
        <ProfileImage profile={profile} size={36} />

        <Spacer paddingHorizontal={6} />

        {/*  Profile text data */}
        <View style={styles.textContainer}>
          {profile && (
            <Typography.Body1 style={styles.address}>
              {getProfileDisplayName(profile)}
            </Typography.Body1>
          )}

          <Typography.Caption style={styles.address} ellipsizeMode="middle" numberOfLines={1}>
            {address}
          </Typography.Caption>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default AccountListItem;
