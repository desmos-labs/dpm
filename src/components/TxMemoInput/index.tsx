import React from 'react';
import TextInput from 'components/TextInput';
import { useTranslation } from 'react-i18next';
import { StyleProp, ViewStyle } from 'react-native';
import useStyles from './useStyles';

interface TxtMemoInputProps {
  /**
   * Custom style that will be applied to the input component.
   */
  style?: StyleProp<ViewStyle>;
  /**
   * The value to show in the input component.
   */
  value?: string;
  /**
   * Provides an initial value that will change when the user starts typing.
   */
  defaultValue?: string;
  /**
   * The string that will be rendered before text input has been entered.
   */
  placeHolder?: string;
  /**
   * Callback that is called when the text input's text changes.
   * Changed text is passed as an argument to the callback handler.
   */
  onChange?: (value: string) => any;
}

/**
 * Component that shows an input that can be used to let the user
 * write the memo that need to be included in a transaction.
 */
const TxMemoInput: React.FC<TxtMemoInputProps> = ({
  style,
  value,
  defaultValue,
  placeHolder,
  onChange,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('transaction');

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
