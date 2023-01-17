import { MsgVoteEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { msgVoteIcon } from 'assets/images';
import { View } from 'react-native';
import Typography from 'components/Typography';
import BaseMessageListItem from 'components/Messages/BaseMessage/BaseMessageListItem';

export type MsgVoteListItemProps = {
  message: MsgVoteEncodeObject;
  date: Date;
};

/**
 * Displays the short details of a MsgVote within a list.
 * @constructor
 */
const MsgVoteListItem = (props: MsgVoteListItemProps) => {
  const { t } = useTranslation();
  const { message, date } = props;
  const { value } = message;

  const voteString = useMemo(() => {
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
  }, [value.option, t]);

  return (
    <BaseMessageListItem
      icon={msgVoteIcon}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Body1>
            {t('vote proposal number with vote', {
              number: value.proposalId?.toString() ?? '?',
              vote: voteString,
            })}
          </Typography.Body1>
        </View>
      )}
    />
  );
};

export default MsgVoteListItem;
