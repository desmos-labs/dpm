import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { AminoMsgVote, MsgVoteEncodeObject } from '@desmoslabs/sdk-core';
import { MsgVote } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { VoteOption } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
	protobufMessage?: MsgVote;
	encodeObject?: MsgVoteEncodeObject['value'];
	aminoMessage?: AminoMsgVote['value'];
};

export const MessageVote: React.FC<Props> = ({
	protobufMessage,
	encodeObject,
	aminoMessage,
}) => {
	const { t } = useTranslation();

	const voteValue = useMemo(() => {
		const option =
			protobufMessage?.option ?? encodeObject?.option ?? aminoMessage?.option;

		switch (option) {
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
	}, [t, encodeObject?.option, protobufMessage?.option, aminoMessage?.option]);

	const proposalId = useMemo(() => {
		return (
			protobufMessage?.proposalId?.toString() ??
			encodeObject?.proposalId?.toString() ??
			aminoMessage?.proposal_id ??
			'??'
		);
	}, [
		encodeObject?.proposalId,
		protobufMessage?.proposalId,
		aminoMessage?.proposal_id,
	]);

	return (
		<SimpleMessageComponent
			icon={require('../../assets/tx-icons/vote.png')}
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
