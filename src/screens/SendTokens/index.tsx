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
import { safeParseInt } from 'lib/FormatUtils';
import CoinAmountInput from 'components/CoinAmountInput';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import useStyles from './useStyles';
import useSendTokens from './useHooks';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TOKENS>;

const SendTokens = () => {
  const { t } = useTranslation('sendTokens');
  const styles = useStyles();
  const navigation = useNavigation();

  const [address, setAddress] = useState('');
  const [isAddressValid, setIsAddressValid] = useState(true);
  const [sendAmount, setSendAmount] = React.useState<Coin | undefined>();
  const [memo, setMemo] = useState('');
  const sendEnabled = useMemo(
    () => address.length > 0 && isAddressValid && sendAmount !== undefined,
    [address.length, isAddressValid, sendAmount],
  );

  const onAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
    setIsAddressValid(newAddress.length > 0 && validateDesmosAddress(newAddress));
  }, []);

  const onAmountChange = useCallback((newAmount: Coin | undefined, isValid: boolean) => {
    if (isValid) {
      setSendAmount(newAmount);
    } else {
      setSendAmount(undefined);
    }
  }, []);

  const onMemoChange = useCallback((changedMemo: string) => {
    setMemo(changedMemo);
  }, []);

  /**
   * Called when the transaction has been sent successfully
   */
  const onSendSuccess = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const sendTokens = useSendTokens({ onSuccess: onSendSuccess });
  const onNextPressed = useCallback(async () => {
    if (sendAmount) {
      await sendTokens(address, safeParseInt(sendAmount.amount), memo);
    }
  }, [address, sendAmount, memo, sendTokens]);

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={{ navigation }} title={t('common:send')} />}
      touchableWithoutFeedbackDisabled={false}
    >
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
      <CoinAmountInput onChange={onAmountChange} />

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
