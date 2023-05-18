import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useValidator from 'hooks/validator/useValidator';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import useValidatorRewards from 'hooks/staking/useValidatorRewards';
import useRedelegationsFrom from 'hooks/staking/useRedelegationsFrom';
import { ScrollView, View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useValidatorStakedAmount from 'hooks/staking/useValidatorStakedAmount';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { useTranslation } from 'react-i18next';
import useValidatorUnbondingDelegations from 'hooks/staking/useValidatorUnbondingDelegations';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { useActiveAccountAddress } from '@recoil/activeAccount';
import { MsgWithdrawDelegatorRewardEncodeObject } from '@cosmjs/stargate';
import { MsgWithdrawDelegatorRewardTypeUrl } from '@desmoslabs/desmjs';
import RestakeToItem from 'screens/ValidatorStakingInfo/components/RestakeToItem';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Divider from 'components/Divider';
import UnbondingDelegationItem from 'screens/ValidatorStakingInfo/components/UnbondingDelegationItem';
import useStyles from './useStyles';

export interface ValidatorStakingInfoParams {
  readonly validatorOperatorAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_STAKING_INFO>;

const ValidatorStakingInfo: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { validatorOperatorAddress } = props.route.params;
  const { t } = useTranslation('staking');
  const styles = useStyles();

  // -------- VARIABLE --------
  const activeAccountAddress = useActiveAccountAddress()!;

  // --------- HOOKS ---------

  const broadcastTx = useBroadcastTx();
  const { data: validator, loading: validatorLoading } = useValidator(validatorOperatorAddress);
  const { data: totalStaked, loading: totalStakedLoading } =
    useValidatorStakedAmount(validatorOperatorAddress);
  const { data: redelegations, loading: redelegationsLoading } =
    useRedelegationsFrom(validatorOperatorAddress);
  const { data: unbondingTokens, loading: loadingUnbondingTokens } =
    useValidatorUnbondingDelegations(validatorOperatorAddress);
  const {
    data: pendingRewards,
    loading: pendingRewardsLoading,
    refetch: validatorRewardsRefetch,
  } = useValidatorRewards(validatorOperatorAddress);

  // -------- CALLBACKS --------

  const onClaimRewardsPressed = React.useCallback(() => {
    broadcastTx(
      [
        {
          typeUrl: MsgWithdrawDelegatorRewardTypeUrl,
          value: {
            validatorAddress: validatorOperatorAddress,
            delegatorAddress: activeAccountAddress,
          },
        } as MsgWithdrawDelegatorRewardEncodeObject,
      ],
      {
        onSuccess: validatorRewardsRefetch,
      },
    );
  }, [activeAccountAddress, broadcastTx, validatorOperatorAddress, validatorRewardsRefetch]);

  const onStakePressed = React.useCallback(() => {
    if (validator === undefined) {
      return;
    }

    navigation.navigate(ROUTES.STAKE, {
      validator,
    });
  }, [navigation, validator]);

  const onValidatorPressed = React.useCallback(() => {
    if (validator === undefined) {
      return;
    }

    navigation.navigate(ROUTES.VALIDATOR_DETAILS, {
      validator,
    });
  }, [navigation, validator]);

  const onRestakePressed = React.useCallback(() => {
    // TODO: Implement restake
    console.warn('implement me');
  }, []);

  const onUnbondPressed = React.useCallback(() => {
    // TODO: Implement unbond
    console.warn('implement me');
  }, []);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <ValidatorNameWithStatus
        validator={validator}
        loading={validatorLoading}
        onPress={onValidatorPressed}
      />

      <ScrollView>
        {/* User total delegated amount torward the validator */}
        <View style={styles.inlineDataField}>
          <Typography.Body1>{t('staked')}</Typography.Body1>
          {totalStakedLoading || totalStaked === undefined ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body1>{formatCoins(totalStaked)}</Typography.Body1>
          )}
        </View>
        <Divider />

        {/* User redelegations from this validator torward other ones */}
        <View style={styles.dataField}>
          <Typography.Body>{t('restake to')}</Typography.Body>
          {redelegationsLoading ? (
            <StyledActivityIndicator style={{ alignSelf: 'center' }} />
          ) : (
            redelegations?.map((r, i) => (
              <RestakeToItem redelegation={r} key={`redelegation-${i}`} />
            ))
          )}
        </View>
        <Divider />

        {/* User unbonding tokens from this validator */}
        <View style={styles.inlineDataField}>
          <Typography.Body>{t('unbonding')}</Typography.Body>
          {loadingUnbondingTokens ? (
            <StyledActivityIndicator style={{ alignSelf: 'center' }} />
          ) : (
            <View>
              {unbondingTokens?.map((u, i, a) => (
                <>
                  <UnbondingDelegationItem unbondingDelegation={u} key={`unbonding-${i}`} />
                  {i + 1 < a.length ? <Spacer paddingVertical={8} /> : null}
                </>
              ))}
            </View>
          )}
        </View>
        <Divider />

        {/* User pending rewards torward the validator */}
        <View style={styles.inlineDataField}>
          <Typography.Body>{t('pending rewards')}</Typography.Body>
          {pendingRewardsLoading || pendingRewards === undefined ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body>{formatCoins(pendingRewards)}</Typography.Body>
          )}
        </View>
        <Divider />
      </ScrollView>

      {/* Action buttons */}
      <Button accent mode="contained" onPress={onClaimRewardsPressed}>
        {t('claim rewards')}
      </Button>
      <Spacer paddingVertical={8} />
      <Button mode="contained" onPress={onStakePressed}>
        {t('stake')}
      </Button>
      <Spacer paddingVertical={8} />
      <View style={styles.inlineButtonsContainer}>
        <Button mode="outlined" onPress={onRestakePressed} style={styles.inlineButton}>
          {t('restake')}
        </Button>
        <Spacer paddingHorizontal={8} />
        <Button mode="outlined" onPress={onUnbondPressed} style={styles.inlineButton}>
          {t('unbond')}
        </Button>
      </View>
    </StyledSafeAreaView>
  );
};

export default ValidatorStakingInfo;
