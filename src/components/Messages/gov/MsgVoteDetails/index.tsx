import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import CopiableAddress from 'components/CopiableAddress';
import Typography from 'components/Typography';

/**
 * Displays the full details of a MsgVote
 * @constructor
 */
const MsgVoteDetails: MessageDetailsComponent<MsgVoteEncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.gov');
  const { value } = message;

  const vote = useMemo(() => {
    switch (value.option) {
      case VoteOption.VOTE_OPTION_YES:
        return t('yes');

      case VoteOption.VOTE_OPTION_ABSTAIN:
        return t('abstain');

      case VoteOption.VOTE_OPTION_NO:
        return t('no');

      case VoteOption.VOTE_OPTION_NO_WITH_VETO:
        return t('no with veto');

      default:
        return 'undefined';
    }
  }, [value, t]);

  const proposalId = useMemo(() => value.proposalId?.toString() ?? '??', [value]);

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.gov"
          i18nKey="vote description"
          components={[
            <CopiableAddress address={message.value.voter} />,
            <Typography.SemiBold14 />,
            <Typography.SemiBold14 />,
          ]}
          values={{ vote, proposalId }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgVoteDetails;
