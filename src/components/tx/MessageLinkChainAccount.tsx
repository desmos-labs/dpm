import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
	AminoMsgLinkChainAccount,
	MsgLinkChainAccountEncodeObject,
} from '@desmoslabs/sdk-core';
import { SimpleMessageComponent } from './SimpleMessageComponent';
import { MsgLinkChainAccount } from '@desmoslabs/proto/desmos/profiles/v1beta1/msgs_chain_links';
import { Bech32Address } from '@desmoslabs/proto/desmos/profiles/v1beta1/models_chain_links';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../utilils/find';

export type Props = {
	protobufMessage?: MsgLinkChainAccount;
	encodeObject?: MsgLinkChainAccountEncodeObject['value'];
	aminoMessage?: AminoMsgLinkChainAccount['value'];
};

export const MessageLinkChainAccount: React.FC<Props> = ({
	protobufMessage,
	encodeObject,
	aminoMessage,
}) => {
	const { t } = useTranslation();

	const from = useMemo(() => {
		return (
			protobufMessage?.signer ?? encodeObject?.signer ?? aminoMessage?.signer
		);
	}, [protobufMessage, encodeObject, aminoMessage]);

	const bech32Address = useMemo(() => {
		const chainAddress =
			protobufMessage?.chainAddress ?? encodeObject?.chainAddress;
		if (aminoMessage !== undefined) {
			return aminoMessage.chain_address.value;
		} else if (
			chainAddress !== undefined &&
			chainAddress.typeUrl === '/desmos.profiles.v1beta1.Bech32Address'
		) {
			return Bech32Address.decode(chainAddress.value);
		} else {
			return undefined;
		}
	}, [protobufMessage, encodeObject, aminoMessage]);

	const chainName = useMemo(() => {
		if (aminoMessage !== undefined) {
			return aminoMessage.chain_config.name;
		} else {
			return (
				protobufMessage?.chainConfig?.name ?? encodeObject?.chainConfig?.name
			);
		}
	}, [protobufMessage, encodeObject, aminoMessage]);

	const chainIcon = useMemo(() => {
		const chain =
			chainName !== undefined
				? findLinkableChainInfoByName(chainName)
				: undefined;
		if (chain !== undefined) {
			return chain.icon;
		} else {
			return require('../../assets/chains/cosmos.png');
		}
	}, [chainName]);

	return (
		<SimpleMessageComponent
			customIconView={
				<View style={styles.customIconView}>
					<Image
						style={styles.chainIcon}
						source={require('../../assets/chains/desmos.png')}
					/>
					<Image
						style={styles.disconnectIcon}
						source={require('../../assets/disconnect.png')}
					/>
					<Image style={styles.chainIcon} source={chainIcon} />
				</View>
			}
			fields={[
				{
					label: t('from'),
					value: from,
				},
				{
					label: t('connect to'),
					value: bech32Address?.value ?? '',
				},
			]}
		/>
	);
};

const styles = StyleSheet.create({
	customIconView: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	chainIcon: {
		width: 44,
		height: 44,
	},
	disconnectIcon: {
		width: 24,
		height: 24,
		marginHorizontal: 20,
	},
});
