import { Proposal, ProposalStatus } from 'types/proposals';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import React from 'react';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { useTranslation } from 'react-i18next';
import TopBar from 'components/TopBar';
import { View } from 'react-native';
import Typography from 'components/Typography';
import ProposalStatusBadge from 'components/ProposalStatusBadge';
import Spacer from 'components/Spacer';
import ActiveProposalHeader from 'screens/GovernanceProposalDetails/components/ActiveProposalHeader';
import CompletedProposalHeader from 'screens/GovernanceProposalDetails/components/CompletedProposalHeader';
import ProposalDetails from 'screens/GovernanceProposalDetails/components/ProposalDetails';
import { TabView } from 'react-native-tab-view';
import ThemedTabBar from 'components/ThemedTabBar';
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

  // -------- STATES --------

  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: ProposalDetailsTabs.PROPOSAL_DETAILS, title: t('proposal details') },
    { key: ProposalDetailsTabs.VOTES, title: t('votes') },
  ]);
  const [tabViewHeights, setTabViewHeights] = React.useState<
    Record<ProposalDetailsTabs, number | undefined>
  >({
    [ProposalDetailsTabs.PROPOSAL_DETAILS]: undefined,
    [ProposalDetailsTabs.VOTES]: undefined,
  });

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

  const proposalDetails = React.useMemo(() => {
    if (proposal.status === ProposalStatus.DepositPeriod) {
      return <ProposalDetails proposal={proposal} />;
    }
    return (
      <TabView
        navigationState={{ index, routes }}
        renderTabBar={ThemedTabBar}
        style={{ height: tabViewHeights[routes[index].key] }}
        renderScene={({ route }) => {
          switch (route.key) {
            case ProposalDetailsTabs.PROPOSAL_DETAILS:
              return (
                <View
                  onLayout={(e) =>
                    setTabViewHeights((current) => ({
                      ...current,
                      [route.key]: e.nativeEvent.layout.height + 40,
                    }))
                  }
                >
                  <Spacer paddingVertical={8} />
                  <ProposalDetails proposal={proposal} />
                </View>
              );
            case ProposalDetailsTabs.VOTES:
              return (
                <View
                  onLayout={(e) =>
                    setTabViewHeights((current) => ({
                      ...current,
                      [route.key]: e.nativeEvent.layout.height + 40,
                    }))
                  }
                >
                  <Typography.H5>Votes</Typography.H5>
                </View>
              );
            default:
              return null;
          }
        }}
        onIndexChange={setIndex}
      />
    );
  }, [tabViewHeights, index, proposal, routes]);

  return (
    <StyledSafeAreaView
      topBar={<TopBar title={t('proposal')} stackProps={props} />}
      scrollable={true}
    >
      {/* Proposal id and status */}
      <View style={styles.proposalIdContainer}>
        <Typography.Regular16>#{proposal.id}</Typography.Regular16>
        <Spacer paddingHorizontal={4} />
        <ProposalStatusBadge status={proposal.status} />
      </View>

      <Spacer paddingVertical={4} />

      <Typography.H6>{proposal.title}</Typography.H6>

      <Spacer paddingVertical={12} />

      {/* Proposal information */}
      {isActiveProposal && <ActiveProposalHeader proposal={proposal} />}
      {isCompletedProposal && <CompletedProposalHeader proposal={proposal} />}

      <Spacer paddingVertical={20} />

      {proposalDetails}
    </StyledSafeAreaView>
  );
};

export default GovernanceProposalDetails;
