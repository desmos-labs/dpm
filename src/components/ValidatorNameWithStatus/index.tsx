import { Validator, ValidatorStatus } from 'types/validator';
import React from 'react';
import { View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { defaultProfilePicture } from 'assets/images';
import { Circle, Rect } from 'react-content-loader/native';
import ThemedContentLoader from 'components/ThemedContentLoader';
import useStyles from './useStyles';

export interface ValidatorNameWithStatusPros {
  validator?: Validator;
  loading?: boolean;
}

const ValidatorNameWithStatus: React.FC<ValidatorNameWithStatusPros> = ({ validator, loading }) => {
  const styles = useStyles();
  const { t } = useTranslation('validatorDetails');

  const isValidatorActive = React.useMemo(() => {
    if (!validator) {
      return undefined;
    }
    return !(
      validator.tombStoned ||
      validator.jailed ||
      validator.status !== ValidatorStatus.Bonded
    );
  }, [validator]);

  const status = React.useMemo(() => {
    if (validator?.tombStoned) {
      return t('tombstoned');
    }
    if (validator?.jailed) {
      return t('jailed');
    }
    if (validator?.status === ValidatorStatus.Bonded) {
      return t('active');
    }
    if (validator?.status === ValidatorStatus.Unbonding) {
      return t('unbonding');
    }
    if (validator?.status === ValidatorStatus.Unbonded) {
      return t('unbonded');
    }
    return t('unknown');
  }, [validator, t]);

  return loading ? (
    <ThemedContentLoader height={48} width="100%">
      <Circle x={24} y={24} r={24} />
      <Rect y="0" x={56} height="100%" width="100%" />
    </ThemedContentLoader>
  ) : (
    <View style={styles.root}>
      <AvatarImage
        source={validator ? getValidatorAvatar(validator) : defaultProfilePicture}
        size={48}
      />
      <View style={styles.details}>
        <Typography.Body>{validator ? getValidatorName(validator) : ''}</Typography.Body>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              isValidatorActive ? styles.statusDotActive : styles.statusDotInactive,
            ]}
          />
          <Typography.Caption
            style={[
              styles.statusText,
              isValidatorActive ? styles.statusTextActive : styles.statusTextInactive,
            ]}
          >
            {status}
          </Typography.Caption>
        </View>
      </View>
    </View>
  );
};

export default ValidatorNameWithStatus;
