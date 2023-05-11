import { Validator, ValidatorStatus } from 'types/validator';
import React from 'react';
import { View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface DetailsHeaderPros {
  validator: Validator;
}

const DetailsHeader: React.FC<DetailsHeaderPros> = ({ validator }) => {
  const styles = useStyles();

  const status = React.useMemo(() => {
    if (validator.jailed) {
      return 'jailed';
    }
    if (validator.tombStoned) {
      return 'tomb stoned';
    }
    if (validator.status === ValidatorStatus.Bonded) {
      return 'active';
    }
    if (validator.status === ValidatorStatus.Unbonding) {
      return 'unbonding';
    }
    if (validator.status === ValidatorStatus.Unbonded) {
      return 'unbonded';
    }
    return 'unknown';
  }, [validator]);

  return (
    <View style={styles.root}>
      <AvatarImage source={getValidatorAvatar(validator)} size={48} />
      <View style={styles.details}>
        <Typography.Body>{getValidatorName(validator)}</Typography.Body>
        <Typography.Caption>{status}</Typography.Caption>
      </View>
    </View>
  );
};

export default DetailsHeader;
