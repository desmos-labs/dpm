import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import React from 'react';
import MaterialCommunityIcon from 'react-native-paper/src/components/MaterialCommunityIcon';
import icoMoonConfig from './selection.json';

const desmosIcons = [
	'authorization',
	'profile',
	'back',
	'camera',
	'settings',
	'edit',
	'more',
	'delete',
	'show',
	'hide',
	'arrow-right',
	'menu',
];

const CustomIcon = createIconSetFromIcoMoon(icoMoonConfig);

export type Props = {
	name: string;
	color: string;
	size: number;
	direction?: 'rtl' | 'ltr';
	allowFontScaling?: boolean;
};

export const DesmosIcon: React.FC<Props> = (props) => {
	const { name, color, size, direction, allowFontScaling } = props;
	if (desmosIcons.indexOf(name) >= 0) {
		return (
			<CustomIcon
				name={name}
				color={color}
				// Our icons have less padding so make it a little bit smaller
				// to keep a size similar to MaterialCommunityIcon
				size={size - 4}
				allowFontScaling={allowFontScaling}
			/>
		);
	}
	return (
		<MaterialCommunityIcon
			name={name}
			color={color}
			size={size}
			direction={direction ?? 'ltr'}
			allowFontScaling={allowFontScaling}
		/>
	);
};
