import { StackScreenProps } from '@react-navigation/stack';
import React from 'react';
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
import TxMemoInput from 'components/TxMemoInput';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import useTrackScreen from 'hooks/analytics/useTrackScreen';
import { Screens } from 'types/analytics';
import { Keyboard, TextInput as NativeTextInput } from 'react-native';
import RecipientsList, { RecipientsListRef } from 'screens/SendTokens/components/RecipientsList';
import { DesmosProfile } from 'types/desmos';
import ProfileImage from 'components/ProfileImage';
import useStyles from './useStyles';
import useSendTokens from './useHooks';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SEND_TOKENS>;

const SendTokens = () => {
  const { t } = useTranslation('sendTokens');
  const styles = useStyles();
  const navigation = useNavigation();

  useTrackScreen(Screens.SendTokens);

  // -------- REFS --------

  const inputRef = React.useRef<NativeTextInput>(null);
  const recipientsListRef = React.useRef<RecipientsListRef>(null);

  // -------- STATES --------

  const [profile, setProfile] = React.useState<DesmosProfile>({ address: '' });
  const [sendAmount, setSendAmount] = React.useState<Coin | undefined>();
  const [memo, setMemo] = React.useState('');

  // -------- VARIABLES --------

  const isAddressValid = React.useMemo(
    () => profile.address.length > 0 && validateDesmosAddress(profile.address),
    [profile.address],
  );

  const sendEnabled = React.useMemo(
    () => profile.address.length > 0 && isAddressValid && sendAmount !== undefined,
    [profile, isAddressValid, sendAmount],
  );

  // -------- CALLBACKS --------

  const onAddressChange = React.useCallback((newAddress: string) => {
    setProfile({
      address: newAddress,
    });
  }, []);

  const onAmountChange = React.useCallback((newAmount: Coin | undefined, isValid: boolean) => {
    if (isValid) {
      setSendAmount(newAmount);
    } else {
      setSendAmount(undefined);
    }
  }, []);

  const touchableWithoutFeedbackOnPress = React.useCallback(() => {
    Keyboard.dismiss();
    recipientsListRef.current?.hide();
  }, []);

  const onSendSuccess = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const sendTokens = useSendTokens({ onSuccess: onSendSuccess });
  const onNextPressed = React.useCallback(async () => {
    if (sendAmount) {
      await sendTokens(profile.address, safeParseInt(sendAmount.amount), memo);
    }
  }, [profile, sendAmount, memo, sendTokens]);

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={{ navigation }} title={t('common:send')} />}
      touchableWithoutFeedbackDisabled={false}
      touchableWithoutFeedbackOnPress={touchableWithoutFeedbackOnPress}
    >
      {/* Address */}
      <Typography.Subtitle style={styles.topMarginSmall}>
        {t('recipient address')}
      </Typography.Subtitle>
      <TextInput
        inputRef={inputRef}
        style={styles.topMarginSmall}
        leftElement={
          profile.dtag !== undefined ? <ProfileImage size={28} profile={profile} /> : undefined
        }
        placeholder={t('insert address')}
        value={profile.address}
        onChangeText={onAddressChange}
        numberOfLines={1}
        error={!isAddressValid}
      />
      <RecipientsList
        ref={recipientsListRef}
        attachTo={inputRef}
        searchValue={profile.address}
        onSelect={setProfile}
      />

      {/* Amount */}
      <Typography.Subtitle style={styles.topMarginSmall}>{t('amount')}</Typography.Subtitle>
      <CoinAmountInput
        amountLimitConfig={React.useMemo(
          () => ({
            mode: AmountLimit.UserBalance,
          }),
          [],
        )}
        onChange={onAmountChange}
        containerStyle={styles.topMarginSmall}
      />

      {/* Transaction note / memo */}
      <Typography.Subtitle style={styles.topMarginSmall}>
        {t('transaction:memo')}
      </Typography.Subtitle>
      <TxMemoInput style={styles.topMarginSmall} value={memo} onChange={setMemo} />

      {/* Spacer */}
      <Flexible.Padding flex={1} />

      {/* Send button */}
      <DKeyboardAvoidingView>
        <Button mode="contained" disabled={!sendEnabled} onPress={onNextPressed}>
          {t('common:next')}
        </Button>
      </DKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default SendTokens;
