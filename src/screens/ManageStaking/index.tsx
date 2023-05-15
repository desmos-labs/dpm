import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import TopBar from 'components/TopBar';
import { useTranslation } from 'react-i18next';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import DpmTabBar from 'components/DpmTabBar';
import StakedTab from './tabs/Staked';
import RestakingTab from './tabs/Restaking';
import UnbondingTab from './tabs/Unbonding';

enum ManageStakingTabs {
  STAKED = 'STAKED',
  RESTAKING = 'RESTAKING',
  UNBONDING = 'UNBONDING',
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.MANAGE_STAKING>;

const renderScene = SceneMap({
  [ManageStakingTabs.STAKED]: StakedTab,
  [ManageStakingTabs.RESTAKING]: RestakingTab,
  [ManageStakingTabs.UNBONDING]: UnbondingTab,
});

const ManageStaking: React.FC<NavProps> = (props) => {
  const { t } = useTranslation('manageStaking');
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: ManageStakingTabs.STAKED, title: t('staked') },
    { key: ManageStakingTabs.RESTAKING, title: t('restaking') },
    { key: ManageStakingTabs.UNBONDING, title: t('unbonding') },
  ]);

  return (
    <>
      <TopBar stackProps={props} title={t('manage staking')} />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={DpmTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </>
  );
};

export default ManageStaking;
