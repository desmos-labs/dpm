import { Proposal, ProposalStatus } from 'types/proposals';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { useTranslation } from 'react-i18next';
import TopBar from 'components/TopBar';
import { Dimensions, ScrollView, View } from 'react-native';
import Typography from 'components/Typography';
import ProposalStatusBadge from 'components/ProposalStatusBadge';
import Spacer from 'components/Spacer';
import ActiveProposalHeader from 'screens/GovernanceProposalDetails/components/ActiveProposalHeader';
import CompletedProposalHeader from 'screens/GovernanceProposalDetails/components/CompletedProposalHeader';
import ProposalDetails from 'screens/GovernanceProposalDetails/components/ProposalDetails';
import { Tabs } from 'react-native-collapsible-tab-view';
import Votes from 'screens/GovernanceProposalDetails/components/Votes';
import StyledMaterialTabBar from 'components/TabBar/MaterialTabBar';
import useStyles from './useStyles';

enum ProposalDetailsTabs {
  PROPOSAL_DETAILS = 'PROPOSAL_DETAILS',
  VOTES = 'VOTES',
}

export interface GovernanceProposalDetailsParams {
  /**
   * Governance proposal to which show the details.
   */
  readonly proposal: Proposal;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.GOVERNANCE_PROPOSAL_DETAILS>;

const GovernanceProposalDetails: React.FC<NavProps> = (props) => {
  const { proposal } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation('governance');

  const [tabsWidth, setTabsWidth] = React.useState(Dimensions.get('window').width - 32);

  // -------- VARIABLES --------

  const isActiveProposal = React.useMemo(
    () =>
      proposal.status === ProposalStatus.VotingPeriod ||
      proposal.status === ProposalStatus.DepositPeriod,
    [proposal.status],
  );

  const isCompletedProposal = React.useMemo(
    () => proposal.status === ProposalStatus.Rejected || proposal.status === ProposalStatus.Passed,
    [proposal.status],
  );

  const Header = React.useCallback(
    () => (
      <View pointerEvents="box-none">
        {/* Proposal id and status */}
        <View style={styles.proposalIdContainer}>
          <Typography.Regular16>#{proposal.id}</Typography.Regular16>
          <Spacer paddingHorizontal={4} />
          <ProposalStatusBadge status={proposal.status} />
        </View>
        <Spacer paddingVertical={4} />
        <View pointerEvents="none">
          <Typography.H6>{proposal.title}</Typography.H6>
        </View>
        <Spacer paddingVertical={12} />
        {/* Proposal information */}
        {isActiveProposal && <ActiveProposalHeader proposal={proposal} />}
        {isCompletedProposal && <CompletedProposalHeader proposal={proposal} />}
        <Spacer paddingTop={40} />
      </View>
    ),
    [isActiveProposal, isCompletedProposal, proposal, styles.proposalIdContainer],
  );

  const proposalDetails = React.useMemo(() => {
    if (
      proposal.status === ProposalStatus.DepositPeriod ||
      proposal.status === ProposalStatus.Invalid
    ) {
      return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <Header />
          <ProposalDetails proposal={proposal} />
        </ScrollView>
      );
    }

    return (
      <Tabs.Container
        renderHeader={Header}
        headerContainerStyle={styles.headerContainer}
        width={tabsWidth}
        renderTabBar={StyledMaterialTabBar}
        minHeaderHeight={-25}
      >
        <Tabs.Tab name={ProposalDetailsTabs.PROPOSAL_DETAILS} label={t('proposal details')}>
          {/* @ts-ignore */}
          <Tabs.ScrollView showsVerticalScrollIndicator={false}>
            <ProposalDetails proposal={proposal} />
          </Tabs.ScrollView>
        </Tabs.Tab>
        <Tabs.Tab name={ProposalDetailsTabs.VOTES} label={t('votes')}>
          <Votes proposalId={proposal.id} />
        </Tabs.Tab>
      </Tabs.Container>
    );
  }, [proposal, Header, styles.headerContainer, tabsWidth, t]);

  return (
    <StyledSafeAreaView
      scrollable={false}
      touchableWithoutFeedbackDisabled={true}
      topBar={<TopBar style={styles.topBar} title={t('proposal')} stackProps={props} />}
      onLayout={(e) => {
        setTabsWidth(e.nativeEvent.layout.width);
      }}
    >
      {proposalDetails}
    </StyledSafeAreaView>
  );
};

export default GovernanceProposalDetails;
