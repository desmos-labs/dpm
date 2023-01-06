import React, { useCallback, useState } from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { Snackbar } from 'react-native-paper';
import { DesmosProfile } from 'types/desmosTypes';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const styles = useStyles();

  const [snackBarMessage, setShowSnackbar] = useState<string | null>(null);
  const { chainLinks, loadingChainLinks } = useQueries(profile?.address);

  const onAddressCopy = useCallback(() => {
    if (!profile?.address) return;
    Clipboard.setString(profile.address);
    setShowSnackbar(t('address copied'));
  }, [profile]);

  const closeSnackBar = useCallback(() => {
    setShowSnackbar(null);
  }, []);

  return (
    <View style={styles.root}>
      {/* Header */}
      <ProfileHeader
        // topRightElement={EditProfileBtn}
        profile={profile}
        onCopyPressed={onAddressCopy}
      />

      {/* Biography */}
      {profile?.bio && (
        <View style={styles.bioContainer}>
          <Typography.Body1 style={styles.bioText} numberOfLines={2}>
            {profile.bio}
          </Typography.Body1>
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>
        {profile ? (
          <ChainLinks loading={loadingChainLinks} chainLinks={chainLinks} canEdit={canEdit} />
        ) : (
          <NonExistingProfile canCreate={canEdit} />
        )}
      </View>

      {/* Snackbar to show the copied address toast */}
      <Snackbar
        visible={snackBarMessage !== null}
        onDismiss={closeSnackBar}
        action={{
          label: t('hide'),
        }}
        duration={Snackbar.DURATION_SHORT}
      >
        {snackBarMessage}
      </Snackbar>
    </View>
  );
};

export default ProfileData;
