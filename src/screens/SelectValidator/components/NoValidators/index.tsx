import React from 'react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { noValidators } from 'assets/images';
import Spacer from 'components/Spacer';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export interface NoValidatorProps {
  error?: Error;
}

const NoValidators: React.FC<NoValidatorProps> = ({ error }) => {
  const styles = useStyles();
  const { t } = useTranslation('common');

  return (
    <View style={styles.root}>
      <Spacer paddingVertical={32} />
      <FastImage style={styles.image} source={noValidators} resizeMode={'contain'} />
      <Spacer paddingVertical={16} />
      <Typography.Body>{error === undefined ? t('no results') : error.message}</Typography.Body>
    </View>
  );
};

export default NoValidators;
