import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message: MsgVoteEncodeObject['value'];
};

/**
 * Displays the full details of a MsgVote
 * @constructor
 */
export const MessageVoteDetails: React.FC<Props> = ({ message }) => {
  const { t } = useTranslation();

  const voteValue = useMemo(() => {
    switch (message.option) {
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
  }, [t, message]);

  const proposalId = useMemo(() => message?.proposalId?.toString() ?? '??', [message]);
  return (
    <BaseMessageDetails
      icon={require('../../../../assets/tx-icons/vote.png')}
      iconSubtitle={t('vote proposal number with vote', {
        number: proposalId,
        vote: voteValue,
      })}
      fields={[
        {
          label: t('proposal number'),
          value: proposalId,
        },
        {
          label: t('vote'),
          value: voteValue,
        },
      ]}
    />
  );
};
