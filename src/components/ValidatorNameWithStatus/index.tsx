import { Validator } from 'types/validator';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Typography from 'components/Typography';
import { defaultProfilePicture } from 'assets/images';
import { Circle, Rect } from 'react-content-loader/native';
import ThemedContentLoader from 'components/ThemedContentLoader';
import IconButton from 'components/IconButton';
import Flexible from 'components/Flexible';
import ValidatorStatus from 'components/ValidatorStatus';
import useStyles from './useStyles';

export interface ValidatorNameWithStatusPros {
  /**
   * Validator to be displayed.
   */
  validator?: Validator;
  /**
   * If true, the component will show some animations
   * to inform the user that the validator is being fetched.
   */
  loading?: boolean;
  /**
   * Callback called when the user presses on the component.
   */
  onPress?: () => void;
}

/**
 * Component that displays the validator image, name and its status.
 * This component is intended to be used inside screens where we are showing
 * the information about a validator.
 */
const ValidatorNameWithStatus: React.FC<ValidatorNameWithStatusPros> = ({
  validator,
  loading,
  onPress,
}) => {
  const styles = useStyles();

  return loading ? (
    <ThemedContentLoader height={48} width="100%">
      <Circle x={24} y={24} r={24} />
      <Rect y="0" x={56} height="100%" width="100%" />
    </ThemedContentLoader>
  ) : (
    <TouchableOpacity onPress={onPress} disabled={onPress === undefined}>
      <View style={styles.root}>
        {/* Validator avatar */}
        <AvatarImage
          source={validator ? getValidatorAvatar(validator) : defaultProfilePicture}
          size={48}
        />

        {/* Validator info */}
        <View style={styles.details}>
          <Typography.Body>{validator ? getValidatorName(validator) : ''}</Typography.Body>
          <ValidatorStatus validator={validator} />
        </View>

        <Flexible.Padding flex={1} />
        {/* Arrow icon to suggest press action to the user */}
        {onPress !== undefined && <IconButton icon={'chevron-right'} />}
      </View>
    </TouchableOpacity>
  );
};

export default ValidatorNameWithStatus;
