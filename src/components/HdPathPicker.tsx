import React, { useEffect, useState } from 'react';
import { makeStyleWithProps } from '../theming';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { DESMOS_COIN_TYPE, HdPath } from '../types/hdpath';
import { TextInput } from './TextInput';
import { Typography } from './index';

export type Props = {
	/**
	 * Function called when the HDPath changes.
	 */
	onChange?: (path: HdPath) => void;
	/**
	 * The component value
	 */
	value?: HdPath;
	/**
	 * True to make the component read only.
	 */
	disabled?: boolean;
	/**
	 * True to allow the editing of the coin type value.
	 */
	allowCoinTypeEdit?: boolean;
	style?: StyleProp<ViewStyle>;
};

const safeParseInt = (value: string) => {
	const number = parseInt(value);
	if (isNaN(number)) {
		return 0;
	} else {
		return number;
	}
};

export const HdPathPicker: React.FC<Props> = (props) => {
	const styles = useStyle(props);
	const [hdPath, setHdPath] = useState<HdPath>(
		props.value ?? {
			coinType: DESMOS_COIN_TYPE,
			account: 0,
			change: 0,
			addressIndex: 0,
		}
	);

	useEffect(() => {
		if (props.value !== undefined) {
			setHdPath(props.value);
		}
	}, [props.value]);

	const onElementChange = (value: string, element: keyof HdPath) => {
		let newHdPath = hdPath;
		switch (element) {
			case 'coinType': {
				newHdPath = {
					...hdPath,
					coinType: safeParseInt(value),
				};
				break;
			}
			case 'account':
				newHdPath = {
					...hdPath,
					account: safeParseInt(value),
				};
				break;
			case 'change':
				newHdPath = {
					...hdPath,
					change: safeParseInt(value),
				};
				break;
			case 'addressIndex':
				newHdPath = {
					...hdPath,
					addressIndex: safeParseInt(value),
				};
				break;
		}
		setHdPath(newHdPath);
		if (props.onChange !== undefined) {
			props.onChange(newHdPath);
		}
	};

	return (
		<View
			style={StyleSheet.compose(
				styles.root as StyleProp<ViewStyle>,
				props.style
			)}
		>
			{props.allowCoinTypeEdit === true ? (
				<>
					<Typography.Body1 style={styles.hdPathText}>m/44'/</Typography.Body1>
					<TextInput
						style={styles.elements}
						inputStyle={styles.input}
						keyboardType="numeric"
						onChangeText={(v) => onElementChange(v, 'coinType')}
						value={hdPath.coinType.toString()}
						editable={props.disabled !== true}
					/>
					<Text style={styles.hdPathText}>/</Text>
				</>
			) : (
				<Typography.Body1 style={styles.hdPathText}>
					m/44'/{hdPath.coinType}'/
				</Typography.Body1>
			)}

			<TextInput
				style={styles.elements}
				inputStyle={styles.input}
				keyboardType="numeric"
				onChangeText={(v) => onElementChange(v, 'account')}
				value={hdPath.account.toString()}
				editable={props.disabled !== true}
			/>
			<Text style={styles.hdPathText}>/</Text>
			<TextInput
				style={styles.elements}
				inputStyle={styles.input}
				keyboardType="numeric"
				onChangeText={(v) => onElementChange(v, 'change')}
				value={hdPath.change.toString()}
				editable={props.disabled !== true}
			/>
			<Text style={styles.hdPathText}>/</Text>
			<TextInput
				style={styles.elements}
				inputStyle={styles.input}
				keyboardType="numeric"
				onChangeText={(v) => onElementChange(v, 'addressIndex')}
				value={hdPath.addressIndex.toString()}
				editable={props.disabled !== true}
			/>
		</View>
	);
};

const useStyle = makeStyleWithProps((props: Props, theme) => ({
	root: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
	},
	elements: {
		maxWidth: 70,
		flexGrow: 1,
	},
	input: {
		textAlignVertical: 'center',
		color: props.disabled ? theme.colors.disabled : theme.colors.text,
	},
	hdPathText: {
		fontFamily: 'Poppins-Regular',
		fontSize: 16,
		fontStyle: 'normal',
		fontWeight: '400',
		lineHeight: 20,
		letterSpacing: 0.005,
		textAlign: 'left',
		color: props.disabled ? theme.colors.disabled : theme.colors.text,
	},
}));
