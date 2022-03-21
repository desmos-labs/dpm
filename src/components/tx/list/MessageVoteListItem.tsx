import React, { useMemo } from 'react';
import { MsgVoteEncodeObject } from '@desmoslabs/sdk-core';
import { View } from 'react-native';
import { BaseMessageListItem } from './BaseMessageListItem';
import { Typography } from '../../typography';
import { useTranslation } from 'react-i18next';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

export type Props = {
	encodeObject: MsgVoteEncodeObject;
	date: Date;
};

export const MessageVoteListItem: React.FC<Props> = (props) => {
	const { encodeObject, date } = props;
	const { t } = useTranslation();

	const voteString = useMemo(() => {
		switch (encodeObject.value.option) {
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
	}, [encodeObject.value.option, t]);

	return (
		<BaseMessageListItem
			icon={require('../../../assets/tx-icons/vote.png')}
			date={date}
			renderContent={() => (
				<View>
					<Typography.Body1>
						{t('vote proposal number with vote', {
							number: encodeObject.value.proposalId?.toString() ?? '?',
							vote: voteString,
						})}
					</Typography.Body1>
				</View>
			)}
		/>
	);
};
