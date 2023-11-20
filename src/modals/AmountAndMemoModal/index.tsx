import React from 'react';
import { ModalComponentProps } from 'modals/ModalScreen';
import { Coin } from '@desmoslabs/desmjs';
import CoinAmountInput from 'components/CoinAmountInput';
import { AmountLimitConfig } from 'components/CoinAmountInput/limits';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import TxMemoInput from 'components/TxMemoInput';
import Spacer from 'components/Spacer';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import useStyles from './useStyles';

type AmountAndMemoModalParams = {
  /**
   * Text to be shown on the top of the modal.
   */
  title: string;
  /**
   * How this component defines the maximum amount that the user can input.
   */
  amountLimitConfig: AmountLimitConfig;
  /**
   * If true hides the memo input.
   */
  hideMemoInput?: boolean;
  /**
   * Function called when the user clicks on the next button.
   */
  onSelect?: (amount: Coin, memo?: string) => void;
};

/**
 * Modal that let the user pick an amount of {@link Coin} and
 * a transaction memo.
 */
const AmountAndMemoModal: React.FC<ModalComponentProps<AmountAndMemoModalParams>> = (props) => {
  const { closeModal } = props;
  const { title, amountLimitConfig, hideMemoInput, onSelect } = props.params;
  const styles = useStyles();
  const { t } = useTranslation();

  // -------- STATES --------

  const [amount, setAmount] = React.useState<Coin>();
  const [memo, setMemo] = React.useState<string>();

  // -------- CALLBACKS --------

  const onAmountChanged = React.useCallback((newAmount: Coin | undefined, isValid: boolean) => {
    if (isValid) {
      setAmount(newAmount);
    } else {
      setAmount(undefined);
    }
  }, []);

  const onNextPressed = React.useCallback(() => {
    closeModal();
    if (amount && onSelect) {
      onSelect(amount, memo);
    }
  }, [amount, closeModal, memo, onSelect]);

  return (
    <DKeyboardAvoidingView style={styles.root}>
      <Typography.H6 style={styles.title}>{title}</Typography.H6>

      <Spacer paddingVertical={12} />

      <CoinAmountInput amountLimitConfig={amountLimitConfig} onChange={onAmountChanged} />
      {hideMemoInput !== true && (
        <>
          <Spacer paddingVertical={8} />
          {/* Transaction note / memo */}
          <Typography.Regular16>{t('transaction:memo')}</Typography.Regular16>
          <TxMemoInput value={memo} onChange={setMemo} />
        </>
      )}

      <Spacer paddingVertical={20} />

      <Button onPress={onNextPressed} disabled={amount === undefined} mode="contained">
        {t('common:next')}
      </Button>
    </DKeyboardAvoidingView>
  );
};

export default AmountAndMemoModal;
