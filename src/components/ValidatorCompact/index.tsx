import { Validator } from 'types/validator';
import React from 'react';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { TouchableOpacity, View } from 'react-native';
import { defaultProfilePicture } from 'assets/images';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import useStyles from './useStyles';

export interface ValidatorCompactProps {
  /**
   * Validator to be displayed.
   */
  validator?: Validator;
  /**
   * If true the component will shows some animations
   * to inform the user that the validator it is being fetched.
   */
  loading?: boolean;
  /**
   * Callback called when the user press on the component.
   */
  onPress?: () => any;
}

/**
 * Component that displays a validator avatar and its name in a row format.
 * This component is intended to be used inside screens where the user is
 * performing an action torward a validator such as selecting the amount of coins
 * to delegate, redelegate or unbond.
 */
const ValidatorCompact: React.FC<ValidatorCompactProps> = ({ validator, loading, onPress }) => {
  const styles = useStyles();

  return (
    <TouchableOpacity onPress={onPress} disabled={onPress === undefined}>
      <View style={styles.root}>
        <AvatarImage
          source={validator ? getValidatorAvatar(validator) : defaultProfilePicture}
          size={32}
          loading={loading}
        />
        <Spacer paddingHorizontal={8} />
        {loading ? (
          <TypographyContentLoaders.Body width={200} />
        ) : (
          <Typography.Body>{validator ? getValidatorName(validator) : 'N/A'}</Typography.Body>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ValidatorCompact;
