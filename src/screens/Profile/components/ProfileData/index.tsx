import React, { useCallback } from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { DesmosProfile } from 'types/desmos';
import Spacer from 'components/Spacer';
import useChainLinksGivenAddress from 'hooks/useChainLinksGivenAddress';
import { useFocusEffect } from '@react-navigation/native';
import ApplicationLinks from 'screens/Profile/components/ApplicationLinks';
import useApplicationLinksGivenAddress from 'hooks/useApplicationLinksGivenAddress';
import NonExistingProfile from '../NonExistingProfile';
import ChainLinks from '../ChainLinksList';
import useStyles from './useStyles';

export interface ProfileDataProps {
  /**
   * Profile data to be shown. If undefined, an empty profile page will be shown instead.
   */
  profile: DesmosProfile | undefined;

  /**
   * Whether the profile data shown can be edited or not.
   */
  canEdit: boolean;
}

const ProfileData = (props: ProfileDataProps) => {
  const { profile, canEdit } = props;
  const styles = useStyles();

  const {
    chainLinks,
    loading: areChainLinksLoading,
    refetch: updateChainLinks,
  } = useChainLinksGivenAddress(profile?.address);

  const {
    applicationLinks,
    loading: areApplicationLinksLoading,
    refetch: updateApplicationLinks,
  } = useApplicationLinksGivenAddress(profile?.address);

  useFocusEffect(
    useCallback(() => {
      // Refresh the data
      updateChainLinks();
      updateApplicationLinks();
    }, [updateApplicationLinks, updateChainLinks]),
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <ProfileHeader profile={profile} />

      {/* Biography */}
      {profile?.bio && (
        <View style={styles.bioContainer}>
          <Typography.Caption style={styles.bioText} numberOfLines={2}>
            {profile.bio}
          </Typography.Caption>
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>
        {profile ? (
          <View style={styles.linksContainer}>
            {applicationLinks.length > 0 && <Spacer paddingVertical={4} />}
            <ApplicationLinks
              loading={areApplicationLinksLoading}
              applicationLinks={applicationLinks}
              canEdit={canEdit}
            />
            <Spacer paddingVertical={8} />
            <ChainLinks loading={areChainLinksLoading} chainLinks={chainLinks} canEdit={canEdit} />
          </View>
        ) : (
          <NonExistingProfile canCreate={canEdit} />
        )}
      </View>
    </View>
  );
};

export default ProfileData;
