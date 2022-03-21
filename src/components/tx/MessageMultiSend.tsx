import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { AminoMsgMultiSend, convertCoin } from '@desmoslabs/sdk-core';
import { MsgMultiSend } from 'cosmjs-types/cosmos/bank/v1beta1/tx';
import { SimpleMessageComponent } from './SimpleMessageComponent';
import { MsgMultiSendEncodeObject } from '../../types/encodeobject';

export type Props = {
	protobufMessage?: MsgMultiSend;
	encodeObject?: MsgMultiSendEncodeObject['value'];
	aminoMessage?: AminoMsgMultiSend['value'];
};

export const MessageMultiSend: React.FC<Props> = ({
	protobufMessage,
	encodeObject,
	aminoMessage,
}) => {
	const { t } = useTranslation();
	const chainInfo = useCurrentChainInfo();

	const amounts = useMemo(() => {
		const inputs =
			protobufMessage?.inputs ??
			encodeObject?.inputs ??
			aminoMessage?.inputs ??
			[];

		return inputs
			.map((input) => {
				const serializedCoins = input.coins
					.map((c) => convertCoin(c, 6, chainInfo.denomUnits))
					.filter((c) => c !== null)
					.map((c) => `${c!.amount} ${c!.denom.toUpperCase()}`)
					.join('\n');
				return `${serializedCoins}`;
			})
			.join(', ');
	}, [
		chainInfo.denomUnits,
		encodeObject?.inputs,
		protobufMessage?.inputs,
		aminoMessage?.inputs,
	]);

	const outputs = useMemo(() => {
		const outputs =
			protobufMessage?.outputs ??
			encodeObject?.outputs ??
			aminoMessage?.outputs ??
			[];

		return outputs
			.map((output) => {
				const serializedCoins = output.coins
					.map((c) => convertCoin(c, 6, chainInfo.denomUnits))
					.filter((c) => c !== null)
					.map((c) => `${c!.amount} ${c!.denom.toUpperCase()}`)
					.join('\n');
				return {
					amount: serializedCoins,
					to: output.address,
				};
			})
			.map((serializedOutput) => {
				return [
					{
						label: t('to'),
						value: serializedOutput.to,
					},
					{
						label: t('amount'),
						value: serializedOutput.amount,
					},
				];
			})
			.reduce((oldValue, value) => [...oldValue, ...value], []);
	}, [
		chainInfo.denomUnits,
		encodeObject?.outputs,
		protobufMessage?.outputs,
		aminoMessage?.outputs,
		t,
	]);

	return (
		<SimpleMessageComponent
			icon={require('../../assets/tx-icons/send.png')}
			iconSubtitle={amounts}
			fields={[...outputs]}
		/>
	);
};
