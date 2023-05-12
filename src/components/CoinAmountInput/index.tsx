import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { StyleProp, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import { formatCoin, formatNumber, safePartFloat } from 'lib/FormatUtils';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import { useCurrentChainInfo } from '@recoil/settings';
import { useTranslation } from 'react-i18next';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { coin } from '@cosmjs/amino';
import useStyles from './useStyles';

export interface CoinAmountInputProps {
  /**
   * Callback called when the amount changes.
   * @param amount - Current amount represented as coin, if undefined means
   * that the input has been cleared.
   * @param isValid - Tells if the amount is valid, to be valida the amount
   * must be defined and less equals than the current active user available
   * amount.
   */
  onChange?: (amount: Coin | undefined, isValid: boolean) => any;
  /**
   * Style applied to the input container, this can be used to add margin
   * and padding between this component and other ones.
   */
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Component that let the user input an amount of coins that can be
 * at least the maximum available coins that the current active user have.
 */
const CoinAmountInput: React.FC<CoinAmountInputProps> = ({ onChange, containerStyle }) => {
  const styles = useStyles();
  const { t } = useTranslation('components.coinAmountInput');

  // -------- INPUT STATE --------
  const [inputAmount, setInputAmount] = React.useState('');
  const [isInputValid, setIsInputValid] = React.useState(true);

  // -------- HOOKS --------
  const { loading, balance } = useActiveAccountBalance();
  const chainInfo = useCurrentChainInfo();

  // -------- CONSTANTS --------
  const spendable = React.useMemo(
    () =>
      balance.find((c) => c.denom === chainInfo.stakeCurrency.coinMinimalDenom) ??
      coin(0, chainInfo.stakeCurrency.coinMinimalDenom),
    [chainInfo, balance],
  );
  // Factor to convert the input value to the stake currency coin.
  const currencyConversionFactor = React.useMemo(
    () => 10 ** chainInfo.stakeCurrency.coinDecimals,
    [chainInfo],
  );

  // -------- CALLBACKS --------
  const onAmountChange = React.useCallback(
    (changedAmount: string) => {
      const parsedAmount = safePartFloat(changedAmount);
      const accountBalance = safePartFloat(spendable.amount);
      // Convert the amount from the chain denom to the minimal denom.
      const convertedAmount = Math.trunc(parsedAmount * currencyConversionFactor);
      const amountAllowed = convertedAmount <= accountBalance;
      setInputAmount(changedAmount);
      setIsInputValid(amountAllowed);

      if (onChange !== undefined) {
        const newCoin =
          changedAmount.length > 0
            ? coin(convertedAmount, chainInfo.stakeCurrency.coinMinimalDenom)
            : undefined;
        onChange(newCoin, amountAllowed && newCoin !== undefined);
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
    const maxInputAmount = formatNumber(safePartFloat(spendable.amount) / currencyConversionFactor);
    setInputAmount(maxInputAmount);

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
        <Typography.Body>{t('common:available')}:</Typography.Body>
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
