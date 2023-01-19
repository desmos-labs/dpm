import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { msgVoteIcon } from 'assets/images';

export type MsgVoteDetailsProps = {
  message: MsgVoteEncodeObject;
};

/**
 * Displays the full details of a MsgVote
 * @constructor
 */
const MsgVoteDetails = (props: MsgVoteDetailsProps) => {
  const { t } = useTranslation('messages.gov');
  const { message } = props;
  const { value } = message;

  const voteValue = useMemo(() => {
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
    <BaseMessageDetails
      icon={msgVoteIcon}
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

export default MsgVoteDetails;
