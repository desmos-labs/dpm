import { Image, ImageSourcePropType, TouchableOpacity } from 'react-native';
import React from 'react';
import { Typography } from '../typography';
import { makeStyle } from '../../theming';

export type Props = {
	name: string;
	icon: ImageSourcePropType;
	onPress?: () => void;
};

const BlockchainListItem: React.FC<Props> = ({ name, icon, onPress }) => {
	const styles = useStyles();

	return (
		<TouchableOpacity style={styles.chainItem} onPress={onPress}>
			<Image style={styles.chainLogo} source={icon} resizeMode="contain" />
			<Typography.Body1 style={styles.chainName}>{name}</Typography.Body1>
		</TouchableOpacity>
	);
};

const useStyles = makeStyle((theme) => ({
	chainItem: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.background,
		padding: theme.spacing.s,
		borderRadius: theme.roundness,
	},
	chainLogo: {
		width: 32,
		height: 32,
	},
	chainName: {
		marginLeft: theme.spacing.s,
	},
}));

export default BlockchainListItem;
