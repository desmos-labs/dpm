import React from 'react';
import { Validator } from 'types/validator';
import { View } from 'react-native';
import Typography from 'components/Typography';
import FastImage from 'react-native-fast-image';
import Spacer from 'components/Spacer';
import { getValidatorAvatar } from 'lib/ValidatorUtils';
import useStyles from './useStyles';

export interface ValidatorItemProps {
  readonly validator: Validator;
}

const ValidatorListItem: React.FC<ValidatorItemProps> = ({ validator }) => {
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <FastImage
        style={styles.validatorImage}
        resizeMode={'contain'}
        source={getValidatorAvatar(validator)}
      />

      <Spacer paddingHorizontal={10} />

      <View style={styles.validatorDetails}>
        <Typography.Body1>{validator.moniker}</Typography.Body1>
        <Typography.Caption ellipsizeMode={'middle'} numberOfLines={1}>
          {validator.address}
        </Typography.Caption>
        <Typography.Caption>{validator.votingPower}</Typography.Caption>
        <Typography.Caption>{`${validator.commission * 100}%`}</Typography.Caption>
      </View>
    </View>
  );
};

export default ValidatorListItem;
