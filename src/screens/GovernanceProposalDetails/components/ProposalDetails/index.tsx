import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { Proposal, ProposalContent } from 'types/proposals';
import StyledMarkDown from 'components/StyledMarkdown';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import decodeGqlRawMessage from 'lib/GraphQLUtils/message';
import MessageDetails from 'components/Messages/MessageDetails';
import { Message } from 'types/transactions';
import InlineProfile from 'components/InlineProfile';

export interface ProposalDetailsProps {
  /**
   * Proposal of which details will be shown.
   */
  readonly proposal: Proposal;
}

/**
 * Component that displays the information of a proposal.
 * The displayed information are:
 * - Proposal description;
 * - The messages that will be executed if the proposal passes;
 * - Who proposed the proposal;
 * - When the proposal has been submitted;
 * - The proposal end time.
 */
const ProposalDetails: React.FC<ProposalDetailsProps> = ({ proposal }) => {
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

  const planContent = React.useMemo(() => {
    if (proposal.content.map !== undefined) {
      return proposal.content
        .map((content: ProposalContent) => decodeGqlRawMessage(content))
        .map((message: Message, index: number) => (
          <View key={`msg-detail-${index}`}>
            {index > 0 && <Spacer paddingTop={12} />}
            <MessageDetails message={message} toBroadcastMessage={false} />
          </View>
        ));
    }

    // The proposal content is an object, treat it as a gov v1beta1 proposal.
    const proposalContent = proposal.content as ProposalContent;
    return (
      <MessageDetails message={decodeGqlRawMessage(proposalContent)} toBroadcastMessage={false} />
    );
  }, [proposal.content]);

  return (
    <View>
      <Spacer paddingTop={24} />
      {/* Summary */}
      {proposal.summary && proposal.summary.length > 0 && (
        <>
          <Typography.SemiBold14>{t('common:summary')}</Typography.SemiBold14>
          <StyledMarkDown>{proposal.summary}</StyledMarkDown>
          <Spacer paddingVertical={12} />
        </>
      )}

      {/* Description */}
      <Typography.SemiBold14>{t('common:description')}</Typography.SemiBold14>
      <StyledMarkDown>{proposal.description}</StyledMarkDown>
      <Spacer paddingVertical={12} />

      {/* Plan */}
      <Typography.SemiBold14>{t('plan')}</Typography.SemiBold14>
      <Spacer paddingVertical={4} />
      {planContent}
      <Spacer paddingVertical={12} />

      {/* Proposer */}
      <Typography.SemiBold14>{t('proposer')}</Typography.SemiBold14>
      <InlineProfile address={proposal.proposerAddress} />
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
