import React from 'react';
import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/sdk-core';
import { View } from 'react-native';
import { BaseMessageListItem } from './BaseMessageListItem';
import { Typography } from '../../typography';
import { useTranslation } from 'react-i18next';

export type Props = {
	encodeObject: MsgUnlinkChainAccountEncodeObject;
	date: Date;
};

export const MessageUnlinkChainAccountListItem: React.FC<Props> = (props) => {
	const { date, encodeObject } = props;
	const { target } = encodeObject.value;
	const { t } = useTranslation();

	return (
		<BaseMessageListItem
			icon={require('../../../assets/tx-icons/general.png')}
			date={date}
			renderContent={() => (
				<View>
					<Typography.Body1>
						{t('tx type unlink chain account')}
					</Typography.Body1>
					<Typography.Caption>{target}</Typography.Caption>
				</View>
			)}
		/>
	);
};
