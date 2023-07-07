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
import useStyles from './useStyles';

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

      <ProposalDetails proposal={proposal} />
    </StyledSafeAreaView>
  );
};

export default GovernanceProposalDetails;
