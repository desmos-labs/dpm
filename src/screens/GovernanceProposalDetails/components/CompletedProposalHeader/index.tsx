import React from 'react';
import { Proposal, ProposalStatus } from 'types/proposals';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import ProgressBar from 'components/ProgressBar';
import useStyles from './useStyles';

export interface CompletedProposalHeaderProps {
  readonly proposal: Proposal;
}

/**
 * Component that show the information of a proposal that have status
 * Rejected or Passed.
 * If the provided proposal have a different status this component will not
 * be rendered.
 */
const CompletedProposalHeader: React.FC<CompletedProposalHeaderProps> = ({ proposal }) => {
  const styles = useStyles(proposal);
  const { t } = useTranslation('governance');

  const votingTime = React.useMemo(
    () =>
      `${format(new Date(proposal.votingStartTime), 'MMM dd yyyy')} - ${format(
        new Date(proposal.votingEndTime),
        'MMM dd yyyy HH:mm:ss',
      )}`,
    [proposal.votingStartTime, proposal.votingEndTime],
  );

  const values = React.useMemo(() => {
    const results = proposal.proposalResults[0];
    const yesVotes = results?.yes ? parseFloat(results.yes) : 0;
    const noVotes = results?.no ? parseFloat(results.no) : 0;
    const vetoVotes = results?.noWithVeto ? parseFloat(results.noWithVeto) : 0;
    const abstainVotes = results?.abstain ? parseFloat(results.abstain) : 0;
    const totalVotes = yesVotes + noVotes + vetoVotes + abstainVotes;
    if (totalVotes === 0) {
      return {
        yes: 0,
        no: 0,
        veto: 0,
        abstain: 0,
      };
    }

    const [higher] = [
      { value: yesVotes, key: 'yes' },
      { value: noVotes, key: 'no' },
      { value: vetoVotes, key: 'veto' },
      { value: abstainVotes, key: 'abstain' },
    ].sort((a, b) => b.value - a.value);

    return {
      yes: yesVotes / totalVotes,
      no: noVotes / totalVotes,
      veto: vetoVotes / totalVotes,
      abstain: abstainVotes / totalVotes,
      higher: higher.key,
    };
  }, [proposal]);

  if (proposal.status !== ProposalStatus.Rejected && proposal.status !== ProposalStatus.Passed) {
    return null;
  }

  return (
    <View>
      <Typography.SemiBold16>{t('voting time')}</Typography.SemiBold16>
      <Typography.Regular16>{votingTime}</Typography.Regular16>

      <Spacer paddingVertical={12} />

      <View style={styles.resultsContainer}>
        {/* Final result header */}
        <View style={styles.finalResultsContainer}>
          <Typography.SemiBold14>{t('final result')}:</Typography.SemiBold14>
          <Spacer paddingHorizontal={4} />
          <Typography.SemiBold14 style={styles.finalResultText}>
            {proposal.status === ProposalStatus.Passed
              ? t('proposal status passed')
              : t('proposal status rejected')}
          </Typography.SemiBold14>
        </View>

        <Spacer paddingVertical={8} />

        {/* Results percentage */}
        <ProgressBar
          style={values.higher === 'yes' ? styles.higherValueBar : undefined}
          labelStyle={values.higher === 'yes' ? styles.higherValueBarLabel : undefined}
          percentageStyle={values.higher === 'yes' ? styles.higherValueBarLabel : undefined}
          value={values.yes}
          label={t('common:yes')}
          showPercentage={true}
        />
        <Spacer paddingVertical={5} />
        <ProgressBar
          style={values.higher === 'no' ? styles.higherValueBar : undefined}
          labelStyle={values.higher === 'no' ? styles.higherValueBarLabel : undefined}
          percentageStyle={values.higher === 'no' ? styles.higherValueBarLabel : undefined}
          value={values.no}
          label={t('common:no')}
          showPercentage={true}
        />
        <Spacer paddingVertical={5} />
        <ProgressBar
          style={values.higher === 'veto' ? styles.higherValueBar : undefined}
          labelStyle={values.higher === 'veto' ? styles.higherValueBarLabel : undefined}
          percentageStyle={values.higher === 'veto' ? styles.higherValueBarLabel : undefined}
          value={values.veto}
          label={t('veto')}
          showPercentage={true}
        />
        <Spacer paddingVertical={5} />
        <ProgressBar
          style={values.higher === 'abstain' ? styles.higherValueBar : undefined}
          labelStyle={values.higher === 'abstain' ? styles.higherValueBarLabel : undefined}
          percentageStyle={values.higher === 'abstain' ? styles.higherValueBarLabel : undefined}
          value={values.abstain}
          label={t('abstain')}
          showPercentage={true}
        />
      </View>
    </View>
  );
};

export default CompletedProposalHeader;
