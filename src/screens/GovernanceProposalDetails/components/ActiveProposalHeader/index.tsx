import React from 'react';
import { Proposal, ProposalStatus } from 'types/proposals';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { format } from 'date-fns';
import Button from 'components/Button';
import { useTranslation } from 'react-i18next';
import {
  useDepositOnProposal,
  useVoteProposal,
} from 'screens/GovernanceProposalDetails/components/ActiveProposalHeader/hooks';
import useStyles from './useStyles';

export interface Props {
  /**
   * The proposal to display.
   */
  readonly proposal: Proposal;
  /**
   * Callback called if the user successfully voted the proposal.
   */
  readonly onProposalVoted?: () => any;
  /**
   * Callback called if the user successfully deposit on the proposal.
   */
  readonly onDeposit?: () => any;
}

/**
 * Component that show the information of a proposal that have status
 * DepositPeriod or VotingPeriod.
 * If the provided proposal have a different status this component will not
 * be rendered.
 */
const ActiveProposalHeader: React.FC<Props> = ({ proposal, onProposalVoted, onDeposit }) => {
  const styles = useStyles(proposal);
  const { t } = useTranslation('governance');

  // -------- HOOKS --------

  const voteProposal = useVoteProposal(
    proposal,
    React.useMemo(
      () => ({
        onSuccess: onProposalVoted,
      }),
      [onProposalVoted],
    ),
  );

  const depositOnProposal = useDepositOnProposal(
    proposal,
    React.useMemo(
      () => ({
        onSuccess: onDeposit,
      }),
      [onDeposit],
    ),
  );

  // -------- VARIABLES --------

  const { startLabel, startValue, endLabel, endValue } = React.useMemo(() => {
    if (proposal.status === ProposalStatus.VotingPeriod) {
      return {
        startLabel: t('voting starts'),
        startValue: format(new Date(proposal.votingStartTime), 'MMM dd yyyy HH:mm:ss'),
        endLabel: t('voting ends'),
        endValue: format(new Date(proposal.votingEndTime), 'MMM dd yyyy HH:mm:ss'),
      };
    }
    if (proposal.status === ProposalStatus.DepositPeriod) {
      return {
        startLabel: t('deposit starts'),
        startValue: format(new Date(proposal.submitTime), 'MMM dd yyyy HH:mm:ss'),
        endLabel: t('deposit ends'),
        endValue: format(new Date(proposal.depositEndTime), 'MMM dd yyyy HH:mm:ss'),
      };
    }
    return {
      startLabel: undefined,
      startValue: undefined,
      endLabel: undefined,
      endValue: undefined,
    };
  }, [t, proposal]);

  // -------- CALLBACKS --------

  const onButtonPressed = React.useCallback(() => {
    if (proposal.status === ProposalStatus.VotingPeriod) {
      voteProposal();
    } else if (proposal.status === ProposalStatus.DepositPeriod) {
      depositOnProposal();
    }
  }, [depositOnProposal, proposal.status, voteProposal]);

  // Prevent rendering if the proposal status is not correct.
  if (
    proposal.status !== ProposalStatus.VotingPeriod &&
    proposal.status !== ProposalStatus.DepositPeriod
  ) {
    return null;
  }

  return (
    <View>
      {/* Information header */}
      <View style={styles.fieldsContainer} pointerEvents="none">
        {/* Start time */}
        <View style={styles.field}>
          <Typography.SemiBold14 style={styles.text} capitalize>
            {startLabel}
          </Typography.SemiBold14>
          <Typography.Regular14 style={styles.text}>{startValue}</Typography.Regular14>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* End time */}
        <View style={styles.field}>
          <Typography.SemiBold14 style={styles.text} capitalize>
            {endLabel}
          </Typography.SemiBold14>
          <Typography.Regular14 style={styles.text}>{endValue}</Typography.Regular14>
        </View>
      </View>

      <Button mode="contained" onPress={onButtonPressed} style={styles.button}>
        {proposal.status === ProposalStatus.DepositPeriod ? t('deposit') : t('vote')}
      </Button>
    </View>
  );
};

export default ActiveProposalHeader;
