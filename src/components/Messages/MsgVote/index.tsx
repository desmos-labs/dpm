import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { msgVoteIcon } from 'assets/images';
import BaseMessage from '../BaseMessage';
import Typography from '../../Typography';

export type DetailsProps = {
  message: MsgVoteEncodeObject['value'];
};

export type ListItemProps = {
  message: MsgVoteEncodeObject['value'];
  date: Date;
};

namespace MsgVote {
  /**
   * Displays the short details of a MsgVote within a list.
   * @constructor
   */
  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => {
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
      <BaseMessage.ListItem
        icon={msgVoteIcon}
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

  /**
   * Displays the full details of a MsgVote
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = ({ message }) => {
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
      <BaseMessage.Details
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
}

export default MsgVote;
