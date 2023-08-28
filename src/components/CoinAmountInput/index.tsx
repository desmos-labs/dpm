import React from 'react';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { Image, StyleProp, TouchableOpacity, View, ViewStyle } from 'react-native';
import Typography from 'components/Typography';
import {
  formatCoin,
  formatFiatAmount,
  formatNumber,
  getDecimalSeparator,
  isStringNumberValid,
  safeParseFloat,
} from 'lib/FormatUtils';
import { useCurrentChainInfo } from '@recoil/settings';
import { useTranslation } from 'react-i18next';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import { coin } from '@cosmjs/amino';
import { useAmountInputLimit } from 'components/CoinAmountInput/hooks';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { zeroCoinFiatValue } from 'types/prices';
import { iconCurrencyDSM, iconCurrencyUSD } from 'assets/images';
import Spacer from 'components/Spacer';
import bigInt from 'big-integer';
import useStyles from './useStyles';
import { AmountLimit, AmountLimitConfig } from './limits';

export enum CoinAmountInputMode {
  /**
   * In this mode, the input only accepts an amount of coins to
   * be entered by the user.
   */
  CoinOnly,
  /**
   * In this mode, the input allows the user to toggle between
   * entering an amount in coins or its fiat value.
   */
  CoinAndFiatValue,
}

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
  /**
   * Allow to select on which mode the input should operate.
   * If this value is undefine will default to `CoinOnly`.
   */
  inputMode?: CoinAmountInputMode;
  /**
   * The initial amount that this component will show.
   */
  initialValue?: Coin;
}

/**
 * Component that let the user input an amount of coin that can be
 * at least the maximum available balance that the current active user have.
 */
const CoinAmountInput: React.FC<CoinAmountInputProps> = ({
  amountLimitConfig,
  onChange,
  containerStyle,
  inputMode,
  initialValue,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('components.coinAmountInput');

  // -------- INPUT STATE --------

  const [inputAmount, setInputAmount] = React.useState('');
  const [isInputValid, setIsInputValid] = React.useState(true);
  const [isFiatMode, setIsFiatMode] = React.useState(false);
  const [currentCoin, setCurrentCoin] = React.useState<Coin>();

  // -------- HOOKS --------

  const { loading: loadingAmountLimit, amount: amountInputLimit } =
    useAmountInputLimit(amountLimitConfig);
  const chainInfo = useCurrentChainInfo();

  // -------- CONSTANTS --------

  const spendable = React.useMemo(
    () =>
      amountInputLimit ??
      zeroCoinFiatValue({
        amount: '0',
        denom: chainInfo.stakeCurrency.coinMinimalDenom,
      }),
    [chainInfo, amountInputLimit],
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
      const accountBalance = safeParseFloat(spendable.coin.amount, 'en-US');
      // Convert the amount.
      const convertedAmount = isFiatMode
        ? Math.trunc(parsedAmount / spendable.coinConversionFactory)
        : Math.trunc(parsedAmount * currencyConversionFactor);
      const amountAllowed = isNumberValid && convertedAmount <= accountBalance;
      setInputAmount(changedAmount);
      setIsInputValid(amountAllowed);

      if (onChange !== undefined) {
        const newCoin =
          changedAmount.length > 0 && convertedAmount !== Infinity
            ? coin(convertedAmount, chainInfo.stakeCurrency.coinMinimalDenom)
            : undefined;
        setCurrentCoin(newCoin);
        onChange(newCoin, isNumberValid && amountAllowed && newCoin !== undefined);
      }
    },
    [
      spendable.coin.amount,
      spendable.coinConversionFactory,
      currencyConversionFactor,
      onChange,
      chainInfo.stakeCurrency.coinMinimalDenom,
      isFiatMode,
    ],
  );

  const onMaxPressed = React.useCallback(() => {
    const maxInputAmount = formatNumber(
      // Use en-US locale since the value is represented in this locale.
      safeParseFloat(spendable.coin.amount, 'en-US') / currencyConversionFactor,
      false,
    );
    setInputAmount(maxInputAmount);
    setIsInputValid(true);

    if (onChange !== undefined) {
      onChange(spendable.coin, true);
    }
  }, [currencyConversionFactor, onChange, spendable]);

  // Effect to update the input value with the received initial value.
  React.useEffect(() => {
    if (initialValue && initialValue.denom === chainInfo.stakeCurrency.coinMinimalDenom) {
      // Parse the amount
      const value = bigInt(initialValue.amount);
      // Parse the conversion factor.
      const conversion = bigInt(currencyConversionFactor);
      // Perform the division to have the decimal and the integer part.
      const result = value.divmod(conversion);

      let remainder = result.remainder.toString();
      if (remainder !== '0') {
        // We have a remainder, prepend 0s to make the remainder have the
        // same length as the stake currency decimals.
        for (let i = remainder.length; i < chainInfo.stakeCurrency.coinDecimals; i += 1) {
          remainder = `0${remainder}`;
        }
      }

      // Build the decimal value.
      const stringAmount = `${result.quotient}${getDecimalSeparator()}${remainder}`;
      onAmountChange(stringAmount);
    }

    // Ignore the change of onAmountChange, we want to trigger this effect only
    // when the initialValue changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue, currencyConversionFactor, chainInfo.stakeCurrency.coinMinimalDenom]);

  // Effect to re-validate the input after the input limit has been loaded.
  React.useEffect(() => {
    if (!loadingAmountLimit) {
      onAmountChange(inputAmount);
    }

    // Safe to ignore, we want to trigger this effect only when the
    // spendable amount changes to revalidate the input.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadingAmountLimit]);

  // -------- COMPONENTS --------

  const inputRightElement = React.useMemo(() => {
    const mode = inputMode ?? CoinAmountInputMode.CoinOnly;
    const currencyButtonDisabled = loadingAmountLimit || spendable.fiatValue === 0;

    return mode === CoinAmountInputMode.CoinOnly ? (
      <Button onPress={onMaxPressed} disabled={loadingAmountLimit}>
        {t('max')}
      </Button>
    ) : (
      <View style={styles.currencyToggleContainer}>
        <Typography.Regular16>
          {isFiatMode ? 'USD' : chainInfo.stakeCurrency.coinDenom.toUpperCase()}
        </Typography.Regular16>
        <TouchableOpacity
          onPress={() => {
            setIsFiatMode((prevState) => !prevState);
            setInputAmount('');
            setCurrentCoin(undefined);
            setIsInputValid(true);
          }}
          disabled={currencyButtonDisabled}
        >
          <Image
            source={isFiatMode ? iconCurrencyDSM : iconCurrencyUSD}
            style={[
              styles.currencyIcon,
              currencyButtonDisabled ? styles.currencyIconDisabled : undefined,
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  }, [
    spendable.fiatValue,
    inputMode,
    isFiatMode,
    loadingAmountLimit,
    onMaxPressed,
    t,
    chainInfo.stakeCurrency.coinDenom,
    styles.currencyIcon,
    styles.currencyToggleContainer,
    styles.currencyIconDisabled,
  ]);

  return (
    <View style={containerStyle}>
      <TextInput
        placeholder={t('insert amount')}
        value={inputAmount}
        keyboardType="numeric"
        onChangeText={onAmountChange}
        numberOfLines={1}
        error={!isInputValid}
        rightElement={inputRightElement}
      />

      <Spacer padding={4} />

      {/* Tokens Equivalent when in fiat mode */}
      {inputMode === CoinAmountInputMode.CoinAndFiatValue && currentCoin && isFiatMode && (
        <Typography.Regular14 style={styles.dsmEquivalentLabel}>
          {t('equivalent')} {formatCoin(currentCoin)}
        </Typography.Regular14>
      )}

      {/* Spendable amount */}
      <View style={styles.spendableContainer}>
        <Typography.Regular14 style={styles.spendableAmountLabel}>
          {amountLabel}:
        </Typography.Regular14>
        {loadingAmountLimit ? (
          <StyledActivityIndicator />
        ) : (
          <Typography.Regular14>
            <Typography.Regular14>{formatCoin(spendable.coin)}</Typography.Regular14>
            {inputMode === CoinAmountInputMode.CoinAndFiatValue && (
              <Typography.Regular14>
                ,{' '}
                {`${spendable.currencySymbol}${formatFiatAmount(spendable.fiatValue)} ${
                  spendable.currency
                }`}
              </Typography.Regular14>
            )}
          </Typography.Regular14>
        )}
      </View>
    </View>
  );
};

export default CoinAmountInput;
