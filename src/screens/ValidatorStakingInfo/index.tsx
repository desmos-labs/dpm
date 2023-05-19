import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useValidator from 'hooks/validator/useValidator';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import useAccountValidatorPendingStakingRewards from 'hooks/staking/useAccountValidatorPendingStakingRewards';
import useAccountRedelegationsFrom from 'hooks/staking/useAccountRedelegationsFrom';
import { ScrollView, View } from 'react-native';
import Typography from 'components/Typography';
import { formatCoins } from 'lib/FormatUtils';
import useValidatorStakedAmount from 'hooks/staking/useValidatorStakedAmount';
import TypographyContentLoaders from 'components/ContentLoaders/Typography';
import { useTranslation } from 'react-i18next';
import useValidatorUnbondingDelegations from 'hooks/staking/useValidatorUnbondingDelegations';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import RestakeToItem from 'screens/ValidatorStakingInfo/components/RestakeToItem';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import Divider from 'components/Divider';
import UnbondingDelegationItem from 'screens/ValidatorStakingInfo/components/UnbondingDelegationItem';
import {
  useClaimPendingRewards,
  useRestake,
  useUnbondTokens,
} from 'screens/ValidatorStakingInfo/hooks';
import useStyles from './useStyles';

export interface ValidatorStakingInfoParams {
  /**
   * Validator operator address whose information will be shown.
   */
  readonly validatorOperatorAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_STAKING_INFO>;

/**
 * Screen that shows the staking info of a validator like:
 * - Amount of coins that the user delegated to the validator;
 * - Current redelegation from the validator torward other ones;
 * - Unbonding delegations;
 * - Pending rewards.
 * and lets the user perform the following actions:
 * - Claim pending rewards;
 * - Stake more tokens toward the validator;
 * - Redelegate some tokens to another validator;
 * - Unbond some tokens from the validator.
 */
const ValidatorStakingInfo: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { validatorOperatorAddress } = props.route.params;
  const { t } = useTranslation('staking');
  const styles = useStyles();

  // --------- HOOKS ---------

  const { data: validator, loading: validatorLoading } = useValidator(validatorOperatorAddress);

  const { data: totalStaked, loading: totalStakedLoading } =
    useValidatorStakedAmount(validatorOperatorAddress);

  const { data: redelegations, loading: redelegationsLoading } =
    useAccountRedelegationsFrom(validatorOperatorAddress);

  const {
    data: unbondingTokens,
    loading: loadingUnbondingTokens,
    refetch: refetchUnbondigDelegations,
  } = useValidatorUnbondingDelegations(validatorOperatorAddress);

  const {
    data: pendingRewards,
    loading: pendingRewardsLoading,
    refetch: validatorRewardsRefetch,
  } = useAccountValidatorPendingStakingRewards(validatorOperatorAddress);

  const claimPendingRewards = useClaimPendingRewards(validatorOperatorAddress);

  const unbondTokens = useUnbondTokens(validatorOperatorAddress);

  // -------- CALLBACKS --------

  const onClaimRewardsPressed = React.useCallback(() => {
    claimPendingRewards({
      onSuccess: validatorRewardsRefetch,
    });
  }, [claimPendingRewards, validatorRewardsRefetch]);

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

  const onRestakePressed = useRestake(validatorOperatorAddress);

  const onUnbondPressed = React.useCallback(() => {
    unbondTokens(refetchUnbondigDelegations);
  }, [refetchUnbondigDelegations, unbondTokens]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <ValidatorNameWithStatus
        validator={validator}
        loading={validatorLoading}
        onPress={onValidatorPressed}
      />

      <Spacer paddingVertical={8} />

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
        <View style={redelegationsLoading ? styles.inlineDataField : styles.dataField}>
          <Typography.Body1>{t('restake to')}</Typography.Body1>
          {redelegationsLoading ? (
            <StyledActivityIndicator />
          ) : (
            redelegations?.map((r, i) => (
              <RestakeToItem redelegation={r} key={`redelegation-${i}`} />
            ))
          )}
        </View>
        <Divider />

        {/* User unbonding tokens from this validator */}
        <View style={styles.inlineDataField}>
          <Typography.Body1>{t('unbonding')}</Typography.Body1>
          {loadingUnbondingTokens ? (
            <StyledActivityIndicator />
          ) : (
            <View>
              {unbondingTokens?.map((u, i, a) => (
                <View key={`unbonding-${i}`}>
                  <UnbondingDelegationItem unbondingDelegation={u} />
                  {i + 1 < a.length ? <Spacer paddingVertical={8} /> : null}
                </View>
              ))}
            </View>
          )}
        </View>
        <Divider />

        {/* User pending rewards torward the validator */}
        <View style={styles.inlineDataField}>
          <Typography.Body1>{t('pending rewards')}</Typography.Body1>
          {pendingRewardsLoading || pendingRewards === undefined ? (
            <TypographyContentLoaders.Body width={200} />
          ) : (
            <Typography.Body1>{formatCoins(pendingRewards)}</Typography.Body1>
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
      <Spacer paddingVertical={16} />
    </StyledSafeAreaView>
  );
};

export default ValidatorStakingInfo;
