import { Proposal } from 'types/proposals';
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

  return (
    <StyledSafeAreaView topBar={<TopBar title={t('proposal')} stackProps={props} />}>
      <View style={styles.proposalIdContainer}>
        <Typography.Regular16>#{proposal.id}</Typography.Regular16>
        <Spacer paddingHorizontal={4} />
        <ProposalStatusBadge status={proposal.status} />
      </View>

      <Spacer paddingVertical={4} />

      <Typography.H6>{proposal.title}</Typography.H6>
    </StyledSafeAreaView>
  );
};

export default GovernanceProposalDetails;
