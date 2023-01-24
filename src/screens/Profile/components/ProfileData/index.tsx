import React from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { ApplicationLink, ChainLink, DesmosProfile } from 'types/desmos';
import Spacer from 'components/Spacer';
import ApplicationLinks from 'screens/Profile/components/ApplicationLinks';
import NonExistingProfile from '../NonExistingProfile';
import ChainLinks from '../ChainLinksList';
import useStyles from './useStyles';

export interface ProfileDataProps {
  /**
   * Profile data to be shown. If undefined, an empty profile page will be shown instead.
   */
  profile: DesmosProfile | undefined;

  /**
   * Chain links associated with the profile that should be displayed.
   */
  chainLinks: ChainLink[];

  /**
   * Application links associated with the profile that should be displayed.
   */
  applicationLinks: ApplicationLink[];

  /**
   * Whether the profile data shown can be edited or not.
   */
  canEdit: boolean;
}

const ProfileData = (props: ProfileDataProps) => {
  const { profile, canEdit, chainLinks, applicationLinks } = props;
  const styles = useStyles();

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
            <ApplicationLinks applicationLinks={applicationLinks} canEdit={canEdit} />
            <Spacer paddingVertical={8} />
            <ChainLinks chainLinks={chainLinks} canEdit={canEdit} />
          </View>
        ) : (
          <NonExistingProfile canCreate={canEdit} />
        )}
      </View>
    </View>
  );
};

export default ProfileData;
