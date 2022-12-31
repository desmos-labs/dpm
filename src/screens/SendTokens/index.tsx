import { MsgSendEncodeObject } from '@cosmjs/stargate';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import Typography from 'components/Typography';
import useAppContext from 'contexts/AppContext';
import { computeTxFees, messagesGas } from 'types/fees';
import { AccountScreensStackParams } from 'types/navigation';
import { useDecimalSeparator, useParseFloat } from 'hooks/parsing/useDecimalSeparator';
import checkDesmosAddress from 'utilils/validators';
import useSelectedAccount from 'hooks/useSelectedAccount';
import Flexible from 'components/Flexible';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import useStyles from './useStyles';

export type Props = StackScreenProps<AccountScreensStackParams, 'SendToken'>;

const SendTokens: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();
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
      const separator = useDecimalSeparator();
      let isValid =
        changedAmount.length === 0 ||
        new RegExp(`^[0-9]+(\\${separator})?[0-9]*$`).test(changedAmount);
      if (isValid && changedAmount.length > 0) {
        const value = useParseFloat(changedAmount);
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
    const amountNumber = Math.floor(useParseFloat(amount) * 1000000);

    const msgSend: MsgSendEncodeObject = {
      typeUrl: '/cosmos.bank.v1beta1.MsgSend',
      value: {
        fromAddress: currentAccount.address,
        toAddress: address,
        amount: [{ amount: amountNumber.toString(), denom: chainInfo.stakeCurrency.coinDenom }],
      },
    };
    const gas = messagesGas([msgSend]);
    const txFee = computeTxFees(gas, chainInfo.stakeCurrency.coinDenom).average;

    navigation.navigate({
      name: 'ConfirmTx',
      params: {
        messages: [msgSend],
        memo,
        fee: txFee,
      },
    });
  }, [address, amount, chainInfo.stakeCurrency.coinDenom, currentAccount.address, navigation, memo]);

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

      <Flexible.Padding flex={1} />

      <Button mode="contained" disabled={nextDisabled} onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default SendTokens;
