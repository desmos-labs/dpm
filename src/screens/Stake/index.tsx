import { Validator } from 'types/validator';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useTranslation } from 'react-i18next';

export type StakingParams = {
  validator: Validator;
};

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.STAKE>;

const Stake: React.FC<NavProps> = (props) => {
  const { t } = useTranslation('stake');
  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} title={t('stake')} />}
    ></StyledSafeAreaView>
  );
};

export default Stake;
