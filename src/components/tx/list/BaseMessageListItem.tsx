import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import { makeStyle } from '../../../theming';
import { format } from 'date-fns';
import { Typography } from '../../typography';

export type Props = {
	date: Date;
	icon: ImageProps['source'];
	renderContent: () => React.ReactNode;
};

export const BaseMessageListItem: React.FC<Props> = (props) => {
	const { icon, date } = props;
	const styles = useStyles();

	return (
		<View style={styles.root}>
			<View>
				<Image style={styles.image} source={icon} resizeMode="contain" />
			</View>
			<View style={styles.content}>
				{props.renderContent()}
				<Typography.Caption style={styles.date}>
					{format(date, 'dd MMM, HH:mm')}
				</Typography.Caption>
			</View>
		</View>
	);
};

const useStyles = makeStyle((theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		backgroundColor: theme.colors.background,
	},
	image: {
		marginTop: 6,
		width: 34,
		height: 34,
	},
	content: {
		flex: 1,
		marginLeft: 12,
	},
	date: {
		marginTop: 11,
		color: theme.colors.font['3'],
	},
}));
