import React, { useCallback, useMemo, useState } from 'react';
import ProfileHeader from 'components/ProfileHeader';
import { View } from 'react-native';
import Typography from 'components/Typography';
import ChainConnections from 'screens/Profile/components/ChainConnections';
import NonExistingProfile from 'screens/Profile/components/NonExistingProfile';
import { Snackbar } from 'react-native-paper';
import { DesmosProfile } from 'types/desmosTypes';
import Clipboard from '@react-native-community/clipboard';
import { useTranslation } from 'react-i18next';
import useQueries from 'screens/Profile/useQueries';
import useStyles from './useStyles';

export interface ProfileDataProps {
  profile: DesmosProfile | undefined;
}

const ProfileData = (props: ProfileDataProps) => {
  const { profile } = props;
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
      <ProfileHeader profile={profile} onCopyPressed={onAddressCopy} />

      {/* Biography */}
      {profile?.bio && (
        <View style={styles.bioContainer}>
          <Typography.Body1 style={styles.bioText} numberOfLines={3}>
            {profile.bio}
          </Typography.Body1>
        </View>
      )}

      {/* Main content */}
      <View style={styles.content}>
        {profile ? (
          <ChainConnections chainLinks={chainLinks} loading={loadingChainLinks} />
        ) : (
          <NonExistingProfile />
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
