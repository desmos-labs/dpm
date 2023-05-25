import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import { formatCoin, formatNumber, isStringNumberValid, safeParseFloat } from 'lib/FormatUtils';
import { useCurrentChainInfo } from '@recoil/settings';
import { useTranslation } from 'react-i18next';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { coin } from '@cosmjs/amino';
import { useAmountInputLimit } from 'components/CoinAmountInput/hooks';
import useStyles from './useStyles';
import { AmountLimit, AmountLimitConfig } from './limits';

export interface CoinAmountInputProps {
  /**
   * How this component defines the maximum amount that the user can input.
   * Note: to avoid unnecessary query to get the limit this value must be
   * memoized with a React.useMemo.
   */
  amountLimitConfig: AmountLimitConfig;
  /**
   * Callback called when the amount changes.
   * @param amount - Current amount represented as coin, if undefined means
   * that the input has been cleared.
   * @param isValid - Tells if the amount is valid, to be valid the amount
   * must be defined and less or equals to what the user has selected as limit
   * and is specified inside the `amountLimitConfig` prop.
   */
  onChange?: (amount: Coin | undefined, isValid: boolean) => any;
  /**
   * Style applied to the input container, this can be used to add margin
   * and padding between this component and other ones.
   */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Component that let the user input an amount of coin that can be
 * at least the maximum available balance that the current active user have.
 */
const CoinAmountInput: React.FC<CoinAmountInputProps> = ({
  amountLimitConfig,
  onChange,
  containerStyle,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('components.coinAmountInput');

  // -------- INPUT STATE --------
  const [inputAmount, setInputAmount] = React.useState('');
  const [isInputValid, setIsInputValid] = React.useState(true);

  // -------- HOOKS --------
  const { loading, amount } = useAmountInputLimit(amountLimitConfig);
  const chainInfo = useCurrentChainInfo();

  // -------- CONSTANTS --------
  const spendable = React.useMemo(
    () => amount ?? coin(0, chainInfo.stakeCurrency.coinMinimalDenom),
    [chainInfo, amount],
  );
  // Factor to convert the input value to the stake currency coin.
  const currencyConversionFactor = React.useMemo(
    () => 10 ** chainInfo.stakeCurrency.coinDecimals,
    [chainInfo],
  );
  const amountLabel = React.useMemo(
    () =>
      amountLimitConfig.mode === AmountLimit.DelegatedToValidator
        ? t('staking:staked')
        : t('common:available'),
    [amountLimitConfig, t],
  );

  // -------- CALLBACKS --------
  const onAmountChange = React.useCallback(
    (changedAmount: string) => {
      // Test the number format only if the input is not empty.
      const isNumberValid = changedAmount.length === 0 || isStringNumberValid(changedAmount);

      // Parse this with the user's locale.
      const parsedAmount = safeParseFloat(changedAmount);
      // Use en-US locale since the value is represented in this locale.
      const accountBalance = safeParseFloat(spendable.amount, 'en-US');
      // Convert the amount from the chain denom to the minimal denom.
      const convertedAmount = Math.trunc(parsedAmount * currencyConversionFactor);
      const amountAllowed = isNumberValid && convertedAmount <= accountBalance;
      setInputAmount(changedAmount);
      setIsInputValid(amountAllowed);

      if (onChange !== undefined) {
        const newCoin =
          changedAmount.length > 0
            ? coin(convertedAmount, chainInfo.stakeCurrency.coinMinimalDenom)
            : undefined;
        onChange(newCoin, isNumberValid && amountAllowed && newCoin !== undefined);
      }
    },
    [
      spendable.amount,
      currencyConversionFactor,
      onChange,
      chainInfo.stakeCurrency.coinMinimalDenom,
    ],
  );

  const onMaxPressed = React.useCallback(() => {
    const maxInputAmount = formatNumber(
      // Use en-US locale since the value is represented in this locale.
      safeParseFloat(spendable.amount, 'en-US') / currencyConversionFactor,
    );
    setInputAmount(maxInputAmount);
    setIsInputValid(true);

    if (onChange !== undefined) {
      onChange(spendable, true);
    }
  }, [currencyConversionFactor, onChange, spendable]);

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={t('insert amount')}
        value={inputAmount}
        keyboardType="numeric"
        onChangeText={onAmountChange}
        numberOfLines={1}
        error={!isInputValid}
        rightElement={<Button onPress={onMaxPressed}>{t('max')}</Button>}
      />

      {/* Spendable amount */}
      <View style={styles.spendableContainer}>
        <Typography.Body>{amountLabel}:</Typography.Body>
        {!loading && (
          <Typography.Body style={styles.spendableAmountValue}>
            {formatCoin(spendable)}
          </Typography.Body>
        )}
      </View>
    </View>
  );
};

export default CoinAmountInput;
