import Typography from 'components/Typography';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleProp, View, ViewStyle } from 'react-native';
import { Validator, ValidatorStatus as ValidatorStatusEnum } from 'types/validator';
import useStyles from './useStyles';

interface ValidatorStatusProps {
  /**
   * Validator for which the status will be displayed.
   */
  validator: Validator | undefined;
  style?: StyleProp<ViewStyle>;
}

/**
 * Component that displays the validator status.
 */
const ValidatorStatus: React.FC<ValidatorStatusProps> = ({ validator, style }) => {
  const { t } = useTranslation('staking');
  const styles = useStyles();

  const isValidatorActive = React.useMemo(() => {
    if (!validator) {
      return undefined;
    }
    return !(
      validator.tombStoned ||
      validator.jailed ||
      validator.status !== ValidatorStatusEnum.Bonded
    );
  }, [validator]);

  const status = React.useMemo(() => {
    if (validator?.tombStoned) {
      return t('tombstoned');
    }
    if (validator?.jailed) {
      return t('jailed');
    }
    if (validator?.status === ValidatorStatusEnum.Bonded) {
      return t('active');
    }
    if (validator?.status === ValidatorStatusEnum.Unbonding) {
      return t('unbonding');
    }
    if (validator?.status === ValidatorStatusEnum.Unbonded) {
      return t('unbonded');
    }
    return t('unknown');
  }, [validator, t]);
  return (
    <View style={[styles.root, style]}>
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
  );
};

export default ValidatorStatus;
