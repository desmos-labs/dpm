import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import { useTranslation } from 'react-i18next';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Typography from 'components/Typography';
import TxMemoInput from 'components/TxMemoInput';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useValidator from 'hooks/validator/useValidator';
import ValidatorCompact from 'components/ValidatorCompact';
import Spacer from 'components/Spacer';
import CoinAmountInput from 'components/CoinAmountInput';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import { Coin } from '@desmoslabs/desmjs';
import { useRedelegateTokes } from 'screens/Redelegate/hooks';

export interface RedelegateParams {
  /**
   * Validator operator address from which the tokens will be
   * redelegated.
   */
  readonly fromValidatorAddress: string;
  /**
   * Validator operator address to which the tokens will be redelegated.
   */
  readonly toValidatorAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.REDELEGATE>;

/**
 * Screen that allows the user to pick an amount and redelegate an amount
 * of coins from a validato to another one.
 */
const Redelegate: React.FC<NavProps> = (props) => {
  const { fromValidatorAddress, toValidatorAddress } = props.route.params;
  const { t } = useTranslation();

  // -------- STATES --------

  const [redelegateAmount, setRedelegateAmount] = React.useState<Coin>();
  const [memo, setMemo] = React.useState<string>();

  // -------- HOOKS --------

  const { data: fromValidator, loading: lodingfromValidator } = useValidator(fromValidatorAddress);
  const { data: toValidator, loading: loadingToValidator } = useValidator(toValidatorAddress);
  const redelegateTokens = useRedelegateTokes();

  // -------- CALLBACKS ---------

  const onAmountChange = React.useCallback((amount: Coin | undefined, isValid: boolean) => {
    setRedelegateAmount(isValid ? amount : undefined);
  }, []);

  const onRedelegatePressed = React.useCallback(() => {
    redelegateTokens(redelegateAmount, fromValidatorAddress, toValidatorAddress, memo);
  }, [fromValidatorAddress, memo, redelegateAmount, redelegateTokens, toValidatorAddress]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('staking:restake')} />}>
      {/* Validator from which the user is restaking from */}
      <Typography.Body1>{t('staking:restake from')}</Typography.Body1>
      <ValidatorCompact validator={fromValidator} loading={lodingfromValidator} />

      <Spacer paddingVertical={16} />

      {/* Validator to which the user is restaking */}
      <Typography.Body1>{t('staking:restake to')}</Typography.Body1>
      <ValidatorCompact validator={toValidator} loading={loadingToValidator} />

      <Spacer paddingVertical={8} />

      <CoinAmountInput
        amountLimitConfig={React.useMemo(
          () => ({
            mode: AmountLimit.DelegatedToValidator,
            validatorAddress: fromValidatorAddress,
          }),
          [fromValidatorAddress],
        )}
        onChange={onAmountChange}
      />

      {/* Tx memo input */}
      <Spacer paddingVertical={32} />
      <Typography.Body1>{t('transaction:memo')}</Typography.Body1>
      <TxMemoInput onChange={setMemo} />

      <Flexible.Padding flex={1} />

      <Button
        mode={'contained'}
        onPress={onRedelegatePressed}
        disabled={redelegateAmount === undefined}
      >
        {t('common:next')}
      </Button>
      <Spacer paddingVertical={16} />
    </StyledSafeAreaView>
  );
};

export default Redelegate;
