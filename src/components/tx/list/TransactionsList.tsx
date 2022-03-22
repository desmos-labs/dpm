import React, { useCallback } from 'react';
import {
	ScrollView,
	SectionList,
	SectionListRenderItemInfo,
	StyleProp,
	TouchableOpacity,
	View,
	ViewStyle,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { formatDistance } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { ChainAccount } from '../../../types/chain';
import Colors from '../../../constants/colors';
import { Divider } from '../../Divider';
import {
	useFetchTxsGrouppedByDate,
	SectionedTx,
} from '../../../graphql/hooks/useFetchTxsGrouppedByDate';
import { TransactionListMessageItem } from './TransactionListMessageItem';
import { makeStyle } from '../../../theming';
import { BroadcastedTx } from '../../../types/tx';
import { DpmImage } from '../../DpmImage';
import { Typography } from '../../typography';

export type Props = {
	chainAccount: ChainAccount;
	onTxPressed: (tx: BroadcastedTx) => void;
	style?: StyleProp<ViewStyle>;
};

export const TransactionsList: React.FC<Props> = ({
	chainAccount,
	style,
	onTxPressed,
}) => {
	const { txs, loading, fetchMore } = useFetchTxsGrouppedByDate(chainAccount);
	const styles = useStyles();
	const { t } = useTranslation();

	const renderItem = useCallback(
		(info: SectionListRenderItemInfo<BroadcastedTx, SectionedTx>) => {
			const begin = info.index === 0;
			const end = info.index === info.section.data.length - 1;
			const viewStyle: StyleProp<ViewStyle> = {
				borderTopLeftRadius: begin ? 8 : 0,
				borderTopRightRadius: begin ? 8 : 0,
				borderBottomLeftRadius: end ? 8 : 0,
				borderBottomRightRadius: end ? 8 : 0,
			};
			const txDate = new Date(info.item.timestamp);
			return (
				<View style={[styles.txMessage, viewStyle]}>
					{info.item.msgs.map((encodeObject, index, list) => {
						const showDivider = index < list.length - 1;
						return (
							<TouchableOpacity
								key={`msg-${info.index}-${index * 2}`}
								onPress={() => onTxPressed(info.item)}
							>
								<TransactionListMessageItem
									encodeObject={encodeObject}
									date={txDate}
								/>
								{showDivider ? <Divider /> : null}
							</TouchableOpacity>
						);
					})}
				</View>
			);
		},
		[onTxPressed, styles.txMessage]
	);

	return txs.length > 0 || loading ? (
		<SectionList
			style={style}
			sections={txs}
			stickySectionHeadersEnabled={false}
			renderItem={renderItem}
			renderSectionHeader={(info) => {
				const sectionDate = new Date(info.section.date);
				const currentDate = new Date();
				const todaySection =
					currentDate.getUTCDay() === sectionDate.getUTCDay() &&
					currentDate.getUTCMonth() === sectionDate.getUTCMonth() &&
					currentDate.getUTCFullYear() === sectionDate.getUTCFullYear();
				return (
					<Typography.Body style={styles.header}>
						{todaySection
							? t('today')
							: formatDistance(sectionDate, currentDate, {
									addSuffix: true,
							  })}
					</Typography.Body>
				);
			}}
			renderSectionFooter={() => <View style={styles.footer} />}
			keyExtractor={(_, index) => index.toString()}
			onEndReached={fetchMore}
			onEndReachedThreshold={0.5}
			showsVerticalScrollIndicator
			ListFooterComponent={
				<ActivityIndicator
					animating={loading}
					color={Colors.DesmosOrange}
					hidesWhenStopped
					size="small"
				/>
			}
			ItemSeparatorComponent={Divider}
		/>
	) : (
		<View style={styles.noTransactionsView}>
			<DpmImage
				style={styles.noTransactionsImage}
				resizeMode="contain"
				source="no-transaction"
			/>
			<Typography.Body1>{t('no transactions')}</Typography.Body1>
		</View>
	);
};

const useStyles = makeStyle((theme) => ({
	header: {
		paddingBottom: 8,
		color: theme.colors.font['2'],
		textTransform: 'capitalize',
	},
	footer: {
		paddingBottom: 16,
	},
	txMessage: {
		backgroundColor: theme.colors.background,
		paddingVertical: 8,
		paddingHorizontal: 8,
	},
	noTransactionsView: {
		display: 'flex',
		flex: 1,
		alignItems: 'center',
	},
	noTransactionsImage: {
		marginTop: 42,
		height: 180,
	},
}));
