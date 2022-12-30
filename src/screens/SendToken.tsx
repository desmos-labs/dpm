import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Padding } from 'components/Flexible/Padding';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import { Button, StyledSafeAreaView, TextInput, TopBar } from 'components';
import Typography from 'components/Typography';
import { useAppContext } from 'contexts/AppContext';
import { makeStyle } from 'theming';
import { computeTxFees, messagesGas } from 'types/fees';
import { AccountScreensStackParams } from 'types/navigation';
import { decimalSeparator, localeParseFloat } from 'utilils/parsing';
import checkDesmosAddress from 'utilils/validators';
import useSelectedAccount from '../hooks/useSelectedAccount';

export type Props = StackScreenProps<AccountScreensStackParams, 'SendToken'>;

export const SendToken: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyle();
  const currentAccount = useSelectedAccount();
  const [address, setAddress] = useState('');
  const [addressInvalid, setAddressInvalid] = useState(false);
  const [amount, setAmount] = useState('');
  const [amountInvalid, setAmountInvalid] = useState(false);
  const [memo, setMemo] = useState('');
  const { selectedAccountBalance } = useAppContext();
  const chainInfo = useCurrentChainInfo();
  const nextDisabled =
    addressInvalid || amountInvalid || address.length === 0 || amount.length === 0;

  const onAddressChange = useCallback((newAddress: string) => {
    setAddress(newAddress);
    setAddressInvalid(newAddress.length > 0 && !checkDesmosAddress(newAddress));
  }, []);

  const onAmountChange = useCallback(
    (changedAmount: string) => {
      const separator = decimalSeparator();
      let isValid =
        changedAmount.length === 0 ||
        new RegExp(`^[0-9]+(\\${separator})?[0-9]*$`).test(changedAmount);
      if (isValid && changedAmount.length > 0) {
        const value = localeParseFloat(changedAmount);
        const balance = parseFloat(selectedAccountBalance.amount);
        isValid = balance >= value;
      }
      setAmountInvalid(!isValid);
      setAmount(changedAmount);
    },
    [selectedAccountBalance],
  );

  const onMemoChange = useCallback((changedMemo: string) => {
    setMemo(changedMemo);
  }, []);

  const onMaxPressed = useCallback(() => {
    setAmount(selectedAccountBalance.amount);
  }, [selectedAccountBalance]);

  const onNextPressed = useCallback(() => {
    const amountNumber = Math.floor(localeParseFloat(amount) * 1000000);

    const msgSend: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: [{ amount: amountNumber.toString(), denom: chainInfo.stakingDenom }],
      },
    };
    const gas = messagesGas([msgSend]);
    const txFee = computeTxFees(gas, chainInfo.stakingDenom).average;

    navigation.navigate({
      name: 'ConfirmTx',
      params: {
        messages: [msgSend],
        memo,
        fee: txFee,
      },
    });
  }, [address, amount, chainInfo.stakingDenom, currentAccount.address, navigation, memo]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('send')} />}>
      <Typography.Subtitle>{t('recipient address')}</Typography.Subtitle>
      <TextInput
        style={styles.topMarginSmall}
        placeholder={t('insert address')}
        value={address}
        onChangeText={onAddressChange}
        numberOfLines={1}
        error={addressInvalid}
      />
      <TextInput
        style={styles.topMarginSmall}
        placeholder={t('insert amount')}
        value={amount}
        keyboardType="numeric"
        onChangeText={onAmountChange}
        numberOfLines={1}
        error={amountInvalid}
        rightElement={<Button onPress={onMaxPressed}>{t('max')}</Button>}
      />
      <Typography.Body style={styles.topMarginSmall}>
        {t('available')} {selectedAccountBalance.amount} {selectedAccountBalance.denom}
      </Typography.Body>

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

      <Padding flex={1} />

      <Button mode="contained" disabled={nextDisabled} onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyle = makeStyle((theme) => ({
  topMarginMedium: {
    marginTop: theme.spacing.m,
  },
  topMarginSmall: {
    marginTop: theme.spacing.s,
  },
  memoInput: {
    maxHeight: 200,
  },
}));
