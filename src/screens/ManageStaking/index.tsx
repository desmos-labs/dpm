import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_STAKING>;

const ManageStaking: React.FC<NavProps> = (props) => {
  const { t } = useTranslation('manageStaking');
  const styles = useStyles();

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} title={t('manage staking')} />}
    ></StyledSafeAreaView>
  );
};

export default ManageStaking;
