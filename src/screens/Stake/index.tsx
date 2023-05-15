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
import AvatarImage from 'components/AvatarImage';
import { getValidatorAvatar, getValidatorName } from 'lib/ValidatorUtils';
import Spacer from 'components/Spacer';
import CoinAmountInput from 'components/CoinAmountInput';
import { Coin } from '@desmoslabs/desmjs-types/cosmos/base/v1beta1/coin';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { MsgDelegateEncodeObject } from '@cosmjs/stargate';
import { MsgDelegateTypeUrl } from '@desmoslabs/desmjs';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import TxMemoInput from 'components/TxMemoInput';
import useStakingUnbondingDays from 'hooks/staking/useStakingUnbondingDays';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';

export type StakingParams = {
  validator: Validator;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.STAKE>;

const Stake: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('stake');
  const { validator } = props.route.params;
  const styles = useStyles();
  const broadcastTx = useBroadcastTx();
  const currentAccountAddress = useActiveAccountAddress()!;
  const {
    data: unbondingTime,
    loading: loadingUnbondingTime,
    error: errorUnbondingTime,
  } = useStakingUnbondingDays();

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
      broadcastTx(
        [
          {
            typeUrl: MsgDelegateTypeUrl,
            value: {
              amount: stakeAmount,
              validatorAddress: validator.operatorAddress,
              delegatorAddress: currentAccountAddress,
            },
          } as MsgDelegateEncodeObject,
        ],
        {
          memo,
          onSuccess: () =>
            navigation.reset({
              index: 0,
              routes: [{ name: ROUTES.HOME_TABS }],
            }),
        },
      );
    }
  }, [
    broadcastTx,
    currentAccountAddress,
    stakeAmount,
    validator.operatorAddress,
    memo,
    navigation,
  ]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('stake')} />} padding={0}>
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
        <View style={styles.validatorDetailsContainer}>
          <AvatarImage source={getValidatorAvatar(validator)} size={32} />
          <Spacer paddingHorizontal={8} />
          <Typography.Body>{getValidatorName(validator)}</Typography.Body>
        </View>

        <Spacer paddingVertical={8} />

        {/* Stake amount */}
        <CoinAmountInput onChange={onStakeAmountChange} />

        <Spacer paddingVertical={16} />

        {/* Tx memo input */}
        <Typography.Body>{t('tx:memo')}</Typography.Body>
        <TxMemoInput value={memo} onChange={setMemo} />

        <Flexible.Padding flex={1} />

        <Button
          mode={'contained'}
          style={styles.nextButton}
          onPress={onNextPressed}
          disabled={stakeAmount === undefined}
        >
          {t('common:next')}
        </Button>
      </View>
    </StyledSafeAreaView>
  );
};

export default Stake;
