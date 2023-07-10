import React from 'react';
import { Dimensions, View } from 'react-native';
import Typography from 'components/Typography';
import { useTranslation } from 'react-i18next';
import { Proposal, ProposalContent } from 'types/proposals';
import StyledMarkDown from 'components/StyledMarkdown';
import CopiableAddress from 'components/CopiableAddress';
import { format } from 'date-fns';
import Spacer from 'components/Spacer';
import decodeGqlRawMessage from 'lib/GraphQLUtils/message';
import MessageDetails from 'components/Messages/MessageDetails';
import { Message } from 'types/transactions';
import { FlashList } from '@shopify/flash-list';

export interface ProposalDetailsProps {
  readonly proposal: Proposal;
}

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
      const { width: windowWidth } = Dimensions.get('window');
      const messages: Message[] = proposal.content.map((content: ProposalContent) =>
        decodeGqlRawMessage(content),
      );

      // The proposal content is an array, so we have a gov v1 content.
      return (
        <FlashList
          data={messages}
          renderItem={(i) => (
            // We use the window width instead of '100%' as width because
            // we are displaying the items in a horizontal list and so
            // width = '100%' means infinite width.
            <View style={{ width: windowWidth - 32 }}>
              <MessageDetails message={i.item} toBroadcastMessage={false} />
            </View>
          )}
          horizontal={true}
          estimatedItemSize={299}
          ItemSeparatorComponent={() => <Spacer paddingHorizontal={8} />}
        />
      );
    }

    // The proposal content is an object, treat it as a gov v1beta1 proposal.
    const proposalContent = proposal.content as ProposalContent;
    return (
      <MessageDetails message={decodeGqlRawMessage(proposalContent)} toBroadcastMessage={false} />
    );
  }, [proposal.content]);

  return (
    <View>
      {/* Description */}
      <Typography.SemiBold14>{t('common:description')}</Typography.SemiBold14>
      <StyledMarkDown>{proposal.description.replace(/\\n/gm, '\n')}</StyledMarkDown>
      <Spacer paddingVertical={12} />

      {/* Plan */}
      <Typography.SemiBold14>{t('plan')}</Typography.SemiBold14>
      <Spacer paddingVertical={4} />
      {planContent}
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
