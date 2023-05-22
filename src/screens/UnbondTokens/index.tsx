import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import useValidator from 'hooks/validator/useValidator';
import ValidatorCompact from 'components/ValidatorCompact';
import Spacer from 'components/Spacer';
import CoinAmountInput from 'components/CoinAmountInput';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import { Coin } from '@desmoslabs/desmjs';
import TxMemoInput from 'components/TxMemoInput';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import { useUndelegateTokes } from 'screens/UnbondTokens/hooks';

export interface UnbondTokensParams {
  /**
   * Validator operator address from which the
   * tokens will be unbonded.
   */
  readonly fromValidator: string;
  /**
   * Callback called on success.
   */
  readonly onSuccess?: () => any;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.UNBOND_TOKENS>;

/**
 * Screen that let the user unbond an amount of tokens from a validator.
 */
const UnbondTokens: React.FC<NavProps> = (props) => {
  const { fromValidator, onSuccess } = props.route.params;
  const { t } = useTranslation('staking');

  // -------- STATES --------

  const [amount, setAmount] = React.useState<Coin>();
  const [memo, setMemo] = React.useState<string>();

  // -------- HOOKS --------

  const { data: validator, loading: loadingValidator } = useValidator(fromValidator);
  const undelegateTokens = useUndelegateTokes();

  // -------- CALLBACKS --------

  const onAmountChange = React.useCallback((newAmount: Coin | undefined, isValid: boolean) => {
    setAmount(isValid ? newAmount : undefined);
  }, []);

  const onNextPressed = React.useCallback(() => {
    if (amount === undefined) {
      return;
    }

    undelegateTokens(fromValidator, amount, memo, { onSuccess });
  }, [amount, undelegateTokens, fromValidator, memo, onSuccess]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('unbond')} />}>
      {/* Validator info */}
      <Typography.Body1>{t('Unbond from')}</Typography.Body1>
      <ValidatorCompact validator={validator} loading={loadingValidator} />
      <Spacer paddingVertical={8} />

      {/* Amount input field */}
      <CoinAmountInput
        amountLimitConfig={React.useMemo(
          () => ({
            mode: AmountLimit.DelegatedToValidator,
            validatorAddress: fromValidator,
          }),
          [fromValidator],
        )}
        onChange={onAmountChange}
      />
      <Spacer paddingVertical={32} />

      {/* Tx Memo field */}
      <TxMemoInput onChange={setMemo} />

      <Flexible.Padding flex={1} />

      <Button mode={'contained'} disabled={amount === undefined} onPress={onNextPressed}>
        {t('common:next')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default UnbondTokens;
