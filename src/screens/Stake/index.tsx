import { Validator } from 'types/validator';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import CoinAmountInput from 'components/CoinAmountInput';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import TxMemoInput from 'components/TxMemoInput';
import useStakingUnbondingDays from 'hooks/staking/useStakingUnbondingDays';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { useDelegateTokens } from 'screens/Stake/hooks';
import ValidatorCompact from 'components/ValidatorCompact';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import useStyles from './useStyles';

export type StakingParams = {
  /**
   * Validator to which tokens will be delegated.
   */
  validator: Validator;
  /**
   * Callback called if the transaction to stake the tokens
   * will be successfully executed.
   */
  onSuccess?: () => any;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.STAKE>;

/**
 * Screen that let a user stake some coins toward a validator.
 */
const Stake: React.FC<NavProps> = (props) => {
  const { t } = useTranslation('stake');
  const { validator, onSuccess } = props.route.params;
  const styles = useStyles();
  const {
    data: unbondingTime,
    loading: loadingUnbondingTime,
    error: errorUnbondingTime,
  } = useStakingUnbondingDays();
  const delegateTokens = useDelegateTokens();

  // -------- SCREEN STATE --------
  const [stakeAmount, setStakeAmount] = React.useState<Coin | undefined>(undefined);
  const [memo, setMemo] = React.useState('');

  // -------- CALLBACKS --------
  const onStakeAmountChange = React.useCallback((amount: Coin | undefined, isValid: boolean) => {
    if (isValid) {
      setStakeAmount(amount);
    } else {
      setStakeAmount(undefined);
    }
  }, []);

  const onNextPressed = React.useCallback(() => {
    if (stakeAmount !== undefined) {
      delegateTokens(stakeAmount, validator.operatorAddress, memo, onSuccess);
    }
  }, [delegateTokens, stakeAmount, validator.operatorAddress, memo, onSuccess]);

  return (
    <StyledSafeAreaView
      topBar={<TopBar style={styles.topBar} stackProps={props} title={t('stake')} />}
      paddingHorizontal={0}
      touchableWithoutFeedbackDisabled={false}
    >
      {/* Staking lock period warning message */}
      {errorUnbondingTime === undefined && (
        <View style={styles.stakingMessageContainer}>
          {loadingUnbondingTime ? (
            <StyledActivityIndicator />
          ) : (
            <Typography.Caption style={styles.stakingMessage}>
              {t('staking will lock your tokens', { count: unbondingTime })}
            </Typography.Caption>
          )}
        </View>
      )}

      {/*
        Add this container view to restore the default StyledSafeAreaView
        padding because the staking message shouldn't have padding.
      */}
      <View style={styles.content}>
        {/* Information of the validator to which the user id performing the delegation */}
        <Typography.Body>{t('stake to')}</Typography.Body>
        <ValidatorCompact validator={validator} />

        <Spacer paddingVertical={8} />

        {/* Stake amount */}
        <CoinAmountInput
          amountLimitConfig={React.useMemo(
            () => ({
              mode: AmountLimit.UserBalance,
            }),
            [],
          )}
          onChange={onStakeAmountChange}
        />

        <Spacer paddingVertical={16} />

        {/* Tx memo input */}
        <Typography.Body>{t('transaction:memo')}</Typography.Body>
        <TxMemoInput value={memo} onChange={setMemo} />

        <Flexible.Padding flex={1} />

        <DKeyboardAvoidingView>
          <Button
            mode={'contained'}
            style={styles.nextButton}
            onPress={onNextPressed}
            disabled={stakeAmount === undefined}
          >
            {t('common:next')}
          </Button>
        </DKeyboardAvoidingView>
      </View>
    </StyledSafeAreaView>
  );
};

export default Stake;
