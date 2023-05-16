import { Validator, ValidatorStatus } from 'types/validator';
import React from 'react';
import { View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface DetailsHeaderPros {
  validator: Validator;
}

const DetailsHeader: React.FC<DetailsHeaderPros> = ({ validator }) => {
  const styles = useStyles();
  const { t } = useTranslation('validatorDetails');

  const isValidatorActive = React.useMemo(
    () =>
      !(validator.tombStoned || validator.jailed || validator.status !== ValidatorStatus.Bonded),
    [validator],
  );

  const status = React.useMemo(() => {
    if (validator.tombStoned) {
      return t('tombstoned');
    }
    if (validator.jailed) {
      return t('jailed');
    }
    if (validator.status === ValidatorStatus.Bonded) {
      return t('active');
    }
    if (validator.status === ValidatorStatus.Unbonding) {
      return t('unbonding');
    }
    if (validator.status === ValidatorStatus.Unbonded) {
      return t('unbonded');
    }
    return t('unknown');
  }, [validator, t]);

  return (
    <View style={styles.root}>
      <AvatarImage source={getValidatorAvatar(validator)} size={48} />
      <View style={styles.details}>
        <Typography.Body>{getValidatorName(validator)}</Typography.Body>
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

export default DetailsHeader;
