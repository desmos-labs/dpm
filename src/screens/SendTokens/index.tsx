import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import validateDesmosAddress from 'lib/ValidationUtils';
import Flexible from 'components/Flexible';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useNavigation } from '@react-navigation/native';
import useActiveAccountBalance from 'hooks/useActiveAccountBalance';
import { useCurrentChainInfo } from '@recoil/settings';
import { View } from 'react-native';
import { formatCoin, formatNumber, safePartFloat } from 'lib/FormatUtils';
import useStyles from './useStyles';
import useSendTokens from './useHooks';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TOKENS>;

const SendTokens = () => {
  const { t } = useTranslation('sendTokens');
  const styles = useStyles();
  const navigation = useNavigation();

  const chainInfo = useCurrentChainInfo();
  const { loading, balance } = useActiveAccountBalance();
  const spendable = useMemo(
    () => balance.find((coin) => coin.denom === chainInfo.stakeCurrency.coinMinimalDenom),
    [chainInfo, balance],
  );

  const [address, setAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [amount, setAmount] = useState('');
  const [isAmountValid, setIsAmountValid] = useState(true);
  const [memo, setMemo] = useState('');
  const sendEnabled = useMemo(
    () => address.length > 0 && isAddressValid && amount.length > 0 && isAmountValid,
    [address.length, amount.length, isAddressValid, isAmountValid],
  );

  const onAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
    setIsAddressValid(newAddress.length > 0 && validateDesmosAddress(newAddress));
  }, []);

  const onAmountChange = useCallback(
    (changedAmount: string) => {
      const value = safePartFloat(changedAmount);
      const accountBalance = safePartFloat(spendable?.amount || '0');
      setAmount(changedAmount);
      setIsAmountValid(value * 1_000_000 <= accountBalance);
    },
    [spendable],
  );

  const onMaxPressed = useCallback(() => {
    setAmount(formatNumber(safePartFloat(spendable?.amount) / 1_000_000));
  }, [spendable]);

  const onMemoChange = useCallback((changedMemo: string) => {
    setMemo(changedMemo);
  }, []);

  /**
   * Called when the transaction has been sent successfully
   */
  const onSendSuccess = useCallback(() => {
    // Clean all the inputs
    setAddress('');
    setAmount('');
    setMemo('');
    navigation.goBack();
  }, [navigation]);

  const sendTokens = useSendTokens({ onSuccess: onSendSuccess });
  const onNextPressed = useCallback(async () => {
    await sendTokens(address, safePartFloat(amount) * 1_000_000, memo);
  }, [address, amount, memo, sendTokens]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} title={t('send')} />}>
      {/* Address */}
      <Typography.Subtitle>{t('recipient address')}</Typography.Subtitle>
      <TextInput
        style={styles.topMarginSmall}
        placeholder={t('insert address')}
        value={address}
        onChangeText={onAddressChange}
        numberOfLines={1}
        error={!isAddressValid}
      />

      {/* Amount */}
      <Typography.Subtitle>{t('amount')}</Typography.Subtitle>
      <TextInput
        style={styles.topMarginSmall}
        placeholder={t('insert amount')}
        value={amount}
        keyboardType="numeric"
        onChangeText={onAmountChange}
        numberOfLines={1}
        error={!isAmountValid}
        rightElement={<Button onPress={onMaxPressed}>{t('max')}</Button>}
      />

      {/* Spendable amount */}
      <View style={styles.spendableContainer}>
        <Typography.Body>{t('common:available')}:</Typography.Body>
        {!loading && spendable && (
          <Typography.Body style={styles.spendableAmountValue}>
            {formatCoin(spendable)}
          </Typography.Body>
        )}
      </View>

      {/* Transaction note / memo */}
      <Typography.Subtitle style={styles.topMarginMedium}>{t('tx note')}</Typography.Subtitle>
      <TextInput
        style={[styles.topMarginSmall, styles.memoInput]}
        placeholder={t('tx description')}
        value={memo}
        onChangeText={onMemoChange}
        numberOfLines={4}
        maxLength={5000}
        multiline
      />

      {/* Spacer */}
      <Flexible.Padding flex={1} />

      {/* Send button */}
      <Button mode="contained" disabled={!sendEnabled} onPress={onNextPressed}>
        {t('common:next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SendTokens;
