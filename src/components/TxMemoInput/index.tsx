import React from 'react';
import TextInput from 'components/TextInput';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import useStyles from './useStyles';

export interface TxtMemoInputProps {
  style?: StyleProp<ViewStyle>;
  value?: string;
  defaultValue?: string;
  placeHolder?: string;
  onChange?: (value: string) => any;
}

const TxMemoInput: React.FC<TxtMemoInputProps> = ({
  style,
  value,
  defaultValue,
  placeHolder,
  onChange,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('tx');

  return (
    <TextInput
      style={[styles.memoInput, style]}
      placeholder={placeHolder ?? t('memo placeholder')}
      value={value}
      defaultValue={defaultValue}
      onChangeText={onChange}
      numberOfLines={4}
      maxLength={5000}
      multiline
    />
  );
};

export default TxMemoInput;
