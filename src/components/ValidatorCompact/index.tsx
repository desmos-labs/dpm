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
  validator?: Validator;
  loading?: boolean;
  onPress?: () => any;
}

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
