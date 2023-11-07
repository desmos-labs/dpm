import ROUTES from 'navigation/routes';
import React from 'react';
import TopBar from 'components/TopBar';
import { useTranslation } from 'react-i18next';
import { SceneMap, TabView } from 'react-native-tab-view';
import { useWindowDimensions } from 'react-native';
import DpmTabBar from 'components/DpmTabBar';
import Button from 'components/Button';
import useStakeFlow from 'hooks/staking/useStakeFlow';
import { HomeTabsScreenProps } from 'navigation/RootNavigator/HomeTabs/props';
import useDrawerContext from 'lib/AppDrawer/context';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import StakedTab from './tabs/Staked';
import RestakingTab from './tabs/Restaking';
import UnbondingTab from './tabs/Unbonding';

enum ManageStakingTabs {
  STAKED = 'STAKED',
  RESTAKING = 'RESTAKING',
  UNBONDING = 'UNBONDING',
}

type NavProps = HomeTabsScreenProps<ROUTES.MANAGE_STAKING>;

const renderScene = SceneMap({
  [ManageStakingTabs.STAKED]: StakedTab,
  [ManageStakingTabs.RESTAKING]: RestakingTab,
  [ManageStakingTabs.UNBONDING]: UnbondingTab,
});

const ManageStaking: React.FC<NavProps> = (props) => {
  const { t } = useTranslation('manageStaking');
  const { openDrawer } = useDrawerContext();
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: ManageStakingTabs.STAKED, title: t('staking:staked') },
    { key: ManageStakingTabs.RESTAKING, title: t('staking:restaking') },
    { key: ManageStakingTabs.UNBONDING, title: t('staking:unbonding') },
  ]);

  const onStakePressed = useStakeFlow();

  return (
    <StyledSafeAreaView
      topBar={
        <TopBar
          stackProps={{ ...props, navigation: { ...props.navigation, openDrawer } }}
          title={t('manage staking')}
          rightElement={
            <Button mode={'text'} onPress={onStakePressed} labelStyle={{ minWidth: 46 }}>
              {t('stake:stake')}
            </Button>
          }
        />
      }
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        renderTabBar={DpmTabBar}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
      />
    </StyledSafeAreaView>
  );
};

export default ManageStaking;
