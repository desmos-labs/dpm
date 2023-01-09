import React from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { DesmosProfile } from 'types/desmos';
import Spacer from 'components/Spacer';
import useQueries from './useQueries';
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

  const { chainLinks, loadingChainLinks } = useQueries(profile?.address);

  return (
    <View style={styles.root}>
      {/* Header */}
      <ProfileHeader profile={profile} />

      <Spacer paddingVertical={8} />

      {/* Biography */}
      {profile?.bio && (
        <View style={styles.bioContainer}>
          <Typography.Body1 style={styles.bioText} numberOfLines={2}>
            {profile.bio}
          </Typography.Body1>
        </View>
      )}

      <Spacer paddingVertical={8} />

      {/* Main content */}
      <View style={styles.content}>
        {profile ? (
          <ChainLinks loading={loadingChainLinks} chainLinks={chainLinks} canEdit={canEdit} />
        ) : (
          <NonExistingProfile canCreate={canEdit} />
        )}
      </View>
    </View>
  );
};

export default ProfileData;
