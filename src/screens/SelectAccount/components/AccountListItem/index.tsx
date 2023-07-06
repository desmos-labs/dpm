import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import ProfileImage from 'components/ProfileImage';
import Spacer from 'components/Spacer';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { useFetchProfile } from 'screens/SelectAccount/components/AccountListItem/useHooks';
import { desmosLogoRound } from 'assets/images';
import useStyles from './useStyles';

export type AccountListItemProps = {
  /**
   * The Bech32 address that is displayed to the user.
   */
  address: string;
  /**
   * True if the item should be highlighted to the user.
   */
  highlight?: boolean;
  /**
   * Function called when the user click over the item.
   */
  onPress?: () => void;
  /**
   * Amount of time in milliseconds that the component will wait
   * before fetching the profile associated to the provided address.
   * Default 1000ms.
   */
  fetchDelay?: number;
};

const AccountListItem = (props: AccountListItemProps) => {
  const { address, highlight, onPress, fetchDelay } = props;
  const styles = useStyles(highlight);
  const { profile, profileLoading } = useFetchProfile(address, fetchDelay ?? 1000);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} disabled={!onPress}>
      <View style={styles.row}>
        {/* <Typography.Body1 style={styles.number}>#{number}</Typography.Body1> */}

        {/* Profile image */}
        <ProfileImage
          profile={profile}
          size={36}
          loading={profileLoading}
          overrideDefaultProfilePicture={desmosLogoRound}
        />

        <Spacer paddingHorizontal={6} />

        {/*  Profile text data */}
        <View style={styles.textContainer}>
          {profile && (
            <Typography.SemiBold16 style={styles.address}>
              {getProfileDisplayName(profile)}
            </Typography.SemiBold16>
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
