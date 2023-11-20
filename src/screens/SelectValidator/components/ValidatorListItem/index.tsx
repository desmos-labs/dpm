import React from 'react';
import { Validator } from 'types/validator';
import { TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import AvatarImage from 'components/AvatarImage';
import { DesmosProfile } from 'types/desmos';
import useValidatorStakingApr from 'hooks/validator/useValidatorStakingApr';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import useStyles from './useStyles';

interface ValidatorItemProps {
  readonly validator: Validator;
  readonly onPress?: (validator: Validator, profile?: DesmosProfile) => any;
}

const ValidatorListItem: React.FC<ValidatorItemProps> = ({ validator, onPress }) => {
  const styles = useStyles();
  const {
    data: validatorApr,
    loading: loadingApr,
    error: errorApr,
  } = useValidatorStakingApr(validator);

  const onPressItem = React.useCallback(() => {
    if (onPress) {
      onPress(validator, validator.profile);
    }
  }, [onPress, validator]);

  const validatorAprText = React.useMemo(() => {
    if (loadingApr) {
      return <TypographyContentLoaders.Body width={100} />;
    }
    if (errorApr) {
      return null;
    }

    return <Typography.Body>APR {validatorApr}%</Typography.Body>;
  }, [loadingApr, errorApr, validatorApr]);

  return (
    <View style={styles.root}>
      <TouchableOpacity style={styles.touchableArea} onPress={onPressItem}>
        <View style={styles.validatorImage}>
          <AvatarImage source={getValidatorAvatar(validator)} size={40} onPress={onPressItem} />
        </View>

        <Spacer paddingHorizontal={8} />

        <View style={styles.validatorDetails}>
          <Typography.Body1>{getValidatorName(validator)}</Typography.Body1>
          {validatorAprText}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default ValidatorListItem;
