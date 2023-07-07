import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { Proposal } from 'types/proposals';
import StyledMarkDown from 'components/StyledMarkdown';
import CopiableAddress from 'components/CopiableAddress';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import useStyles from './useStyles';

export interface ProposalDetailsProps {
  readonly proposal: Proposal;
}

const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
  const styles = useStyles();
  const { t } = useTranslation('governance');

  // -------- VARIABLES --------

  const submitTime = React.useMemo(
    () => format(new Date(proposal.submitTime), 'MMM dd, yyyy HH:mm:ss'),
    [proposal.submitTime],
  );

  const depositEndTime = React.useMemo(
    () => format(new Date(proposal.depositEndTime), 'MMM dd, yyyy HH:mm:ss'),
    [proposal.depositEndTime],
  );

  return (
    <View>
      <Typography.SemiBold14>{t('common:description')}</Typography.SemiBold14>
      <StyledMarkDown>{proposal.description.replace(/\\n/gm, '\n')}</StyledMarkDown>
      <Spacer paddingVertical={12} />

      {/* Proposer */}
      <Typography.SemiBold14>{t('proposer')}</Typography.SemiBold14>
      <CopiableAddress address={proposal.proposerAddress} />
      <Spacer paddingVertical={12} />

      {/* Submit time */}
      <Typography.SemiBold14>{t('submit time')}</Typography.SemiBold14>
      <Typography.Regular16>{submitTime}</Typography.Regular16>
      <Spacer paddingVertical={12} />

      {/* Deposit end time */}
      <Typography.SemiBold14>{t('deposit end time')}</Typography.SemiBold14>
      <Typography.Regular16>{depositEndTime}</Typography.Regular16>
    </View>
  );
};

export default ProposalDetails;
