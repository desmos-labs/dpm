import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Typography } from '../../../typography';
import { BaseMessageListItem } from '../BaseMessageListItem';

export type Props = {
  message: MsgVoteEncodeObject["value"];
  date: Date;
};

/**
 * Displays the short details of a MsgVote within a list.
 * @constructor
 */
export const MessageVoteListItem: React.FC<Props> = ({ message, date }) => {
  const { t } = useTranslation();

  const voteString = useMemo(() => {
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
  }, [message.option, t]);

  return (
    <BaseMessageListItem
      icon={require('../../../../assets/tx-icons/vote.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('vote proposal number with vote', {
              number: message.proposalId?.toString() ?? '?',
              vote: voteString,
            })}
          </Typography.Body1>
        </View>
      )}
    />
  );
};
