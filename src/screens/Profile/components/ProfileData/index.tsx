import React from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { Rect } from 'react-content-loader/native';
import { ApplicationLink, DesmosProfile } from 'types/desmos';
import Spacer from 'components/Spacer';
import ApplicationLinks from 'screens/Profile/components/ApplicationLinks';
import ThemedContentLoader from 'components/ThemedContentLoader';
import useStyles from './useStyles';

export interface ProfileDataProps {
  /**
   * Profile data to be shown. If undefined, an empty profile page will be shown instead.
   */
  profile: DesmosProfile | undefined;
  /**
   * Application links associated with the profile that should be displayed.
   */
  applicationLinks: ApplicationLink[];
  /**
   * Whether the profile data shown can be edited or not.
   */
  canEdit: boolean;
  /**
   * Tells if the profile is loading.
   */
  loading?: boolean;
}

const ProfileData = (props: ProfileDataProps) => {
  const { profile, canEdit, applicationLinks, loading } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      {/* Header */}
      <ProfileHeader profile={profile} loading={loading} />

      {/* Biography */}
      {loading ? (
        <ThemedContentLoader style={styles.bioContainer} width="90%" height="36">
          <Rect width="100%" height="12" />
          <Rect width="100%" y="20" height="12" />
        </ThemedContentLoader>
      ) : (
        profile?.bio && (
          <View style={styles.bioContainer}>
            <Typography.Caption style={styles.bioText} numberOfLines={2}>
              {profile.bio}
            </Typography.Caption>
          </View>
        )
      )}

      {/* Main content */}
      <View style={styles.content}>
        {profile !== undefined && loading && (
          <View style={styles.linksContainer}>
            {applicationLinks.length > 0 || (loading && <Spacer paddingVertical={4} />)}
            <ApplicationLinks
              applicationLinks={applicationLinks}
              canEdit={canEdit}
              loading={loading}
            />
          </View>
        )}
      </View>
    </View>
  );
};

export default ProfileData;
