import React, { ReactElement } from 'react';
import {
	ImageBackground,
	Platform,
	ScrollView,
	TouchableWithoutFeedback,
	View,
	ViewProps,
} from 'react-native';
import { makeStyleWithProps } from '../theming';
import { Divider } from './Divider';
import useCloseKeyboard from '../hooks/useCloseKeyboard';

export type Props = ViewProps & {
	/**
	 * True if the content should be wrapped inside a ScrollView.
	 */
	scrollable?: boolean;
	/**
	 * View padding.
	 */
	padding?: number;
	/**
	 * Shows an element as a top bar.
	 */
	topBar?: ReactElement;
	/**
	 * If true adds a divider between the
	 * top bar and the content.
	 */
	divider?: boolean;
	/**
	 * Image that will be displayed as background.
	 */
	background?: React.ComponentProps<typeof ImageBackground>['source'];

	/**
	 * If true removes the bottom padding on iOS bottom swipe area
	 */
	noIosPadding?: boolean;
};

export const StyledSafeAreaView: React.FC<Props> = (props) => {
	const styles = useStyles(props);
	const closeKeyboard = useCloseKeyboard();

	return (
		<View style={styles.root}>
			{props.background !== undefined && (
				<ImageBackground style={styles.background} source={props.background} />
			)}
			{props.topBar}
			{props.divider && <Divider />}
			<TouchableWithoutFeedback onPress={closeKeyboard}>
				<View style={[styles.content, props.style]}>
					{props?.scrollable ? (
						<ScrollView>{props.children}</ScrollView>
					) : (
						props.children
					)}
				</View>
			</TouchableWithoutFeedback>
		</View>
	);
};

const useStyles = makeStyleWithProps((props: Props, theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		paddingBottom:
			Platform.OS === 'android' || props.noIosPadding === true ? 0 : 24,
		backgroundColor: theme.colors.background,
	},
	background: {
		position: 'absolute',
		width: '100%',
		height: '100%',
	},
	content: {
		display: 'flex',
		flexDirection: 'column',
		flexGrow: 1,
		padding: props?.padding ?? theme.spacing.m,
		backgroundColor:
			props.background === undefined ? theme.colors.background : 'transparent',
	},
}));
