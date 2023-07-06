import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ProfileImage from 'components/ProfileImage';
import useDrawerContext from 'lib/AppDrawer/context';
import useProfileGivenAddress from 'hooks/useProfileGivenAddress';
import { useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import useStyles from './useStyles';

export type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList>,
  BottomTabScreenProps<HomeTabsParamList, ROUTES.GOVERNANCE_PROPOSALS>
>;

/**
 * Screen that shows the governance proposals and allow
 * the user to interact with them.
 */
const GovernanceProposals: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('governance');
  const styles = useStyles();
  const theme = useTheme();

  const { openDrawer } = useDrawerContext();
  const { profile } = useProfileGivenAddress();

  return (
    <StyledSafeAreaView
      topBar={
        <TopBar
          leftIconColor={theme.colors.icon['1']}
          title={t('proposal')}
          stackProps={{ ...props, navigation: { ...navigation, openDrawer } }}
          rightElement={<ProfileImage size={34} profile={profile} style={styles.avatarImage} />}
        />
      }
    ></StyledSafeAreaView>
  );
};

export default GovernanceProposals;
