import React from 'react';
import { DesmosProfile } from 'types/desmos';
import { TouchableOpacity, View } from 'react-native';
import ProfileImage from 'components/ProfileImage';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface ProfileListItemProps {
  /**
   * The profile to display.
   */
  readonly profile: DesmosProfile;
  /**
   * Callback called when the user pressed on this component.
   */
  readonly onPress?: (profile: DesmosProfile) => any;
}

/**
 * Component that can be used in a list to display a {@link DesmosProfile}.
 */
const ProfileListItem: React.FC<ProfileListItemProps> = ({ profile, onPress }) => {
  const styles = useStyles();

  // -------- CALLBACKS --------

  const onProfilePressed = React.useCallback(() => {
    if (onPress) {
      onPress(profile);
    }
  }, [onPress, profile]);

  return (
    <TouchableOpacity onPress={onProfilePressed} disabled={onPress === undefined}>
      <View style={styles.root}>
        <ProfileImage profile={profile} size={40} />
        <View style={styles.fields}>
          <Typography.SemiBold16>{profile.nickname}</Typography.SemiBold16>
          <Typography.Regular14>{profile.dtag}</Typography.Regular14>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileListItem;
