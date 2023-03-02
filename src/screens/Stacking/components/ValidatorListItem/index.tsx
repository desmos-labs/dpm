import React from 'react';
import { Validator } from 'types/validator';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import AvatarImage from 'components/AvatarImage';
import { defaultProfilePicture } from 'assets/images';
import { DesmosProfile } from 'types/desmos';
import useValidatorProfile from 'hooks/profile/useValidatorProfile';
import { getProfilePicture } from 'lib/ProfileUtils';
import useStyles from './useStyles';

export interface ValidatorItemProps {
  readonly validator: Validator;
  readonly extraField?: React.ReactNode;
  readonly actions?: React.ReactNode;
  readonly onPress?: (validator: Validator, profile?: DesmosProfile) => any;
}

const ValidatorListItem: React.FC<ValidatorItemProps> = ({
  validator,
  extraField,
  actions,
  onPress,
}) => {
  const styles = useStyles();
  const { profile, loading } = useValidatorProfile(validator.operatorAddress);
  const [profilePicture, setProfilePicture] = React.useState(defaultProfilePicture);

  React.useEffect(() => {
    if (loading) {
      setProfilePicture(defaultProfilePicture);
    } else {
      setProfilePicture(getProfilePicture(profile));
    }
  }, [loading, profile, validator]);

  const loadDefaultPicture = React.useCallback(() => {
    setProfilePicture(defaultProfilePicture);
  }, []);

  const onPressItem = React.useCallback(() => {
    if (!loading && onPress) {
      onPress(validator, profile);
    }
  }, [loading, onPress, validator, profile]);

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.touchableArea} onPress={onPressItem}>
        <View style={styles.validatorImage}>
          <AvatarImage
            loading={loading}
            source={profilePicture}
            size={32}
            onError={loadDefaultPicture}
          />
        </View>

        <Spacer paddingHorizontal={8} />

        <View style={styles.validatorDetails}>
          <Typography.Body1>{profile?.nickname}</Typography.Body1>
          <Typography.Caption ellipsizeMode={'middle'} numberOfLines={1}>
            {validator.operatorAddress}
          </Typography.Caption>
          <Typography.Caption>Commission: {`${validator.commission * 100}%`}</Typography.Caption>
          {extraField}
        </View>
      </TouchableOpacity>

      <Spacer paddingHorizontal={8} />

      <View style={styles.validatorActions}>{actions}</View>
    </View>
  );
};

export default ValidatorListItem;
