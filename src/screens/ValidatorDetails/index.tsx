import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { Validator } from 'types/validator';
import React, { FC } from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { getValidatorBio } from 'lib/ValidatorUtils';
import { ScrollView } from 'react-native';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import useValidatorStakingApr from 'hooks/validator/useValidatorStakingApr';
import {
  useStake,
  useTotalValidatorDelegations,
  useTotalVotingPower,
} from 'screens/ValidatorDetails/hooks';
import { formatNumber, roundFloat } from 'lib/FormatUtils';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';
import StyledMarkDown from 'components/StyledMarkdown';
import useStyles from './useStyles';
import ValidatorInfoField from './components/ValidatorInfoField';

export type ValidatorDetailsParams = {
  /**
   * Validator whose details will be shown.
   */
  validator: Validator;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_DETAILS>;

/**
 * Screen that shows the details of a validator allowing the user
 * to delegate some tokens to them.
 */
const ValidatorDetails: FC<NavProps> = (props) => {
  const { validator } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation('validatorDetails');

  // -------- HOOKS --------

  const { data: apr, loading: aprLoading, error: aprError } = useValidatorStakingApr(validator);

  const {
    data: totalDelegations,
    loading: totalDelegationsLoading,
    error: totalDelegationsError,
  } = useTotalValidatorDelegations(validator.operatorAddress);

  const {
    data: totalVotingPower,
    loading: totalVotingPowerLoading,
    error: totalVotingPowerError,
  } = useTotalVotingPower();

  const stakeCoins = useStake();

  // -------- FIELDS VALUES ------------

  const validatorDescription = React.useMemo(
    () =>
      // Replace all the <br/> with a new line because the markdown component
      // don't handle them correctly.
      getValidatorBio(validator)?.replace(/<br\/>/g, '\n') ?? '',
    [validator],
  );

  const validatorCommissions = React.useMemo(() => {
    const percentage = validator.commission * 100;
    return `${formatNumber(roundFloat(percentage, 2))}%`;
  }, [validator.commission]);

  const votingPowerPercentage = React.useMemo(() => {
    if (totalVotingPowerLoading || totalVotingPower === undefined) {
      return 'N/A';
    }
    if (totalVotingPowerError) {
      return t('error loading voting power');
    }

    const percentage = roundFloat((validator.votingPower / totalVotingPower) * 100, 2);
    return `${formatNumber(percentage)}%`;
  }, [totalVotingPowerLoading, totalVotingPowerError, totalVotingPower, validator.votingPower, t]);

  // -------- ACTIONS -----------

  const onStakePressed = React.useCallback(() => {
    stakeCoins(validator);
  }, [stakeCoins, validator]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />} touchableWithoutFeedbackDisabled>
      {/* Validator avatar and online status */}
      <ValidatorNameWithStatus validator={validator} />

      {/* Validator description */}
      <StyledMarkDown>{validatorDescription}</StyledMarkDown>

      {/* Validator info */}
      <ScrollView style={styles.infoContainer}>
        <ValidatorInfoField label={t('website')} value={validator.website ?? 'N/A'} />
        <ValidatorInfoField
          label={t('voting power')}
          extraInfo={
            totalVotingPowerError ? undefined : `${validator.votingPower}/${totalVotingPower}`
          }
          value={votingPowerPercentage}
          loading={totalVotingPowerLoading}
        />
        <ValidatorInfoField label={t('commission')} value={validatorCommissions} />
        <ValidatorInfoField
          label={t('apr')}
          loading={aprLoading}
          value={aprError ? t('error loading apr') : `${apr}%`}
        />
        <ValidatorInfoField
          label={t('no. of delegator')}
          loading={totalDelegationsLoading}
          value={
            totalDelegationsError
              ? t('error loading delegations')
              : totalDelegations?.toString() ?? 'N/A'
          }
        />
      </ScrollView>

      <Button style={styles.stakeButton} mode={'contained'} onPress={onStakePressed}>
        {t('staking:stake')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default ValidatorDetails;
