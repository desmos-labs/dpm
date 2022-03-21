import React from 'react';
import {
	Text,
	StyleProp,
	ViewStyle,
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { makeStyle } from '../theming';
import { Typography } from './index';

export type Props = {
	/**
	 * The word to display.
	 */
	value: string;
	/**
	 * An optional word index that will be displayed on the top right corner.
	 */
	index?: number;
	/**
	 * Function called when the badge is pressed.
	 */
	onPress?: (word: string) => void;
	style?: StyleProp<ViewStyle>;
};

export const MnemonicWordBadge: React.FC<Props> = (props) => {
	const styles = useStyles();

	return (
		<TouchableOpacity
			style={StyleSheet.compose(
				styles.root as StyleProp<ViewStyle>,
				props.style
			)}
			onPress={
				props?.onPress
					? () => {
							props.onPress!(props.value);
					  }
					: undefined
			}
		>
			<Typography.Subtitle>{props.value}</Typography.Subtitle>
			<Text style={styles.index}>{props.index}</Text>
		</TouchableOpacity>
	);
};

const useStyles = makeStyle((theme) => ({
	root: {
		backgroundColor: theme.colors.surface,
		borderRadius: 4,
		padding: theme.spacing.s,
	},
	index: {
		position: 'absolute',
		top: theme.spacing.s,
		right: theme.spacing.s,
		fontSize: 8,
		color: theme.colors.text,
	},
}));
