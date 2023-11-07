import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import CopiableAddress from 'components/CopiableAddress';
import ProfileImage from 'components/ProfileImage';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { makeStyle } from 'config/theme';
import useGetProfile from 'hooks/profile/useGetProfile';
import { getProfileDisplayName } from 'lib/ProfileUtils';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { DesmosProfile } from 'types/desmos';

interface InlineProfileProps {
  /**
   * Address of the profile to display.
   */
  readonly address: string;
  /**
   * Optional prefetched profile.
   */
  readonly profile?: DesmosProfile;
}

/**
 * Components that displays an user profile and if clicked opens the
 * profile screen.
 */
const InlineProfile: React.FC<InlineProfileProps> = ({ address, profile }) => {
  const styles = useStyles();
  const [toDisplayProfile, setToDisplayProfile] = React.useState(profile);
  const [profileLoading, setProfileLoading] = React.useState(profile === undefined);

  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const getProfile = useGetProfile();
  const showProfile = React.useCallback(() => {
    navigation.navigate(ROUTES.PROFILE, {
      visitingProfile: address,
    });
  }, [address, navigation]);

  React.useEffect(() => {
    (async () => {
      if (profile === undefined) {
        setProfileLoading(true);
        const fetchedProfile = await getProfile(address);
        if (fetchedProfile.isOk()) {
          setToDisplayProfile(fetchedProfile.value);
        }
        setProfileLoading(false);
      }
    })();
  }, [address, getProfile, profile]);

  if (toDisplayProfile === undefined && profileLoading === false) {
    return (
      <View style={styles.root}>
        <CopiableAddress address={address} />
      </View>
    );
  }

  return (
    <TouchableOpacity onPress={showProfile}>
      <View style={styles.root}>
        <ProfileImage profile={toDisplayProfile} loading={profileLoading} size={32} />
        <Spacer paddingLeft={8} />
        {profileLoading ? (
          <TypographyContentLoaders.Regular16 width={180} />
        ) : (
          <Typography.Regular16>{getProfileDisplayName(toDisplayProfile!)}</Typography.Regular16>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default InlineProfile;

const useStyles = makeStyle(() => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));
