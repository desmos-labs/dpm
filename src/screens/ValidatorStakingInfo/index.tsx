import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import useValidator from 'hooks/validator/useValidator';
import ValidatorNameWithStatus from 'components/ValidatorNameWithStatus';

export interface ValidatorStakingInfoParams {
  readonly validatorOperatorAddress: string;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.VALIDATOR_STAKING_INFO>;

const ValidatorStakingInfo: React.FC<NavProps> = (props) => {
  const { validatorOperatorAddress } = props.route.params;

  const { data: validator, loading: validatorLoading } = useValidator(validatorOperatorAddress);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <ValidatorNameWithStatus validator={validator} loading={validatorLoading} />
    </StyledSafeAreaView>
  );
};

export default ValidatorStakingInfo;
