import { StdFee } from '@cosmjs/amino';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import { makeStyle } from '../theming';
import { TxFees, TxPriceLevel } from '../types/fees';

function feeToString(fee: StdFee): string {
  let amount = parseInt(fee.amount[0].amount);
  let { denom } = fee.amount[0];

  if (denom[0] === 'u') {
    denom = denom.slice(1).toUpperCase();
    amount /= 100000;
  }

  return `${amount} ${denom}`;
}

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    borderStyle: 'solid',
    flexGrow: 1,
    borderColor: theme.colors.primary,
    padding: theme.spacing.s,
  },
  optionLeft: {
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
    borderTopLeftRadius: theme.roundness,
    borderBottomLeftRadius: theme.roundness,
  },
  optionCenter: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderLeftWidth: 2,
  },
  optionRight: {
    borderTopWidth: 2,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderTopRightRadius: theme.roundness,
    borderBottomRightRadius: theme.roundness,
  },
  selectedOption: {
    backgroundColor: theme.colors.primary,
  },
  optionTitle: {
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  optionSubTitle: {
    color: theme.colors.text,
  },
  selectedOptionTypography: {
    color: theme.colors.font['5'],
  },
}));

export type Props = {
  /**
   * Selected fee level
   */
  feeLevel: TxPriceLevel;
  /**
   * The fees prices to display to the user.
   */
  fees: TxFees;
  /**
   * True to disable the interaction with the component.
   */
  disabled?: boolean;
  /**
   * Callback called when the user selects a fee level.
   * if the component is disabled this callback will not be called.
   */
  onChange?: (fee: StdFee) => void;
};

export const FeePicker: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const [value, setValue] = React.useState<TxPriceLevel>(props.feeLevel);

  const onValueChange = (value: TxPriceLevel) => {
    setValue(value);
    if (props.onChange !== undefined) {
      props.onChange(props.fees[value]);
    }
  };

  return (
    <View style={styles.root}>
      <TouchableOpacity
        style={[styles.option, styles.optionLeft, value === 'low' ? styles.selectedOption : {}]}
        disabled={props.disabled}
        onPress={() => onValueChange('low')}
      >
        <Text style={[styles.optionTitle, value === 'low' ? styles.selectedOptionTypography : {}]}>
          {t('low fee')}
        </Text>
        <Text>{feeToString(props.fees.low)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.option,
          styles.optionCenter,
          value === 'average' ? styles.selectedOption : {},
        ]}
        disabled={props.disabled}
        onPress={() => onValueChange('average')}
      >
        <Text
          style={[styles.optionTitle, value === 'average' ? styles.selectedOptionTypography : {}]}
        >
          {t('average fee')}
        </Text>
        <Text>{feeToString(props.fees.average)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, styles.optionRight, value === 'high' ? styles.selectedOption : {}]}
        disabled={props.disabled}
        onPress={() => onValueChange('high')}
      >
        <Text style={[styles.optionTitle, value === 'high' ? styles.selectedOptionTypography : {}]}>
          {t('high fee')}
        </Text>
        <Text>{feeToString(props.fees.high)}</Text>
      </TouchableOpacity>
    </View>
  );
};
