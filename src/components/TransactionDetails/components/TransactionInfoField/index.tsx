import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';

export interface TransactionInfoFieldProps {
  /**
   * The field label.
   */
  readonly label: string;
  /**
   * The field value.
   */
  readonly value?: string;
  /**
   * True if the value is loading
   */
  readonly loading?: boolean;
  /**
   * Tells if the value can be selected.
   */
  readonly valueSelectable?: boolean;
}

/**
 * Component that shows an information related to a transaction.
 */
const TransactionInfoField: React.FC<TransactionInfoFieldProps> = ({
  label,
  loading,
  value,
  valueSelectable,
}) => {
  const style = useStyles();
  return (
    <View>
      <Typography.Regular14 style={style.label}>{label}</Typography.Regular14>
      {loading === true ? (
        <StyledActivityIndicator style={style.loadingIndicator} />
      ) : (
        <Typography.Regular14 style={style.value} selectable={valueSelectable}>
          {value}
        </Typography.Regular14>
      )}
    </View>
  );
};

export default TransactionInfoField;
