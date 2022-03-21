import React, { useCallback, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { AccountCreationStackParams } from '../../types/navigation';
import { randomMnemonic } from '../../wallet/LocalWallet';
import {
	Button,
	InlineButtons,
	MnemonicGrid,
	StyledSafeAreaView,
	TopBar,
	Typography,
} from '../../components';
import { makeStyle } from '../../theming';
import Colors from '../../constants/colors';

declare type Props = StackScreenProps<
	AccountCreationStackParams,
	'GenerateNewMnemonic'
>;

export default function GenerateNewMnemonic(props: Props): JSX.Element {
	const { navigation } = props;
	const styles = useStyles();
	const { t } = useTranslation();
	const [mnemonic, setMnemonic] = useState<string | null>(null);
	const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(24);
	const [generationDelay, setGenerationDelay] = useState(1500);
	const generatingMnemonic = mnemonic === null;

	const generateMnemonic = useCallback(
		async (length: 12 | 24) => {
			if (generationDelay > 0) {
				return new Promise<string>((resolve) => {
					setTimeout(() => {
						resolve(randomMnemonic(length));
					}, generationDelay);
					setGenerationDelay(0);
				});
			}
			return randomMnemonic(length);
		},
		[generationDelay]
	);

	const changeMnemonicLength = useCallback(
		async (newLength: 12 | 24) => {
			setMnemonicLength(newLength);
			setMnemonic(null);
			const newMnemonic = await generateMnemonic(newLength);
			setMnemonic(newMnemonic);
		},
		[generateMnemonic]
	);

	// Hook to launch the generation when the user enter on the screen
	useEffect(() => {
		generateMnemonic(mnemonicLength).then(setMnemonic);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const onOkPressed = () => {
		navigation.navigate({
			name: 'CheckMnemonic',
			params: {
				mnemonic: mnemonic!,
			},
		});
	};

	return (
		<StyledSafeAreaView
			style={styles.root}
			topBar={<TopBar stackProps={props} />}
		>
			<Typography.Title>{t('secret recovery passphrase')}</Typography.Title>
			<Typography.Subtitle style={styles.saveMnemonicAdvice}>
				<Trans
					i18nKey="save recovery passphrase"
					components={{
						bold: (
							<Typography.Subtitle
								style={{
									color: Colors.DesmosOrange,
									fontFamily: 'Poppins-Bold',
									fontWeight: 'bold',
								}}
							/>
						),
					}}
				/>
			</Typography.Subtitle>

			{generatingMnemonic ? (
				<View style={styles.loadingView}>
					<ActivityIndicator size="large" />
				</View>
			) : (
				<>
					<InlineButtons
						selected={mnemonicLength === 24 ? 0 : 1}
						buttons={[
							{
								label: `24 ${t('words')}`,
								onPress: () => changeMnemonicLength(24),
							},
							{
								label: `12 ${t('words')}`,
								onPress: () => changeMnemonicLength(12),
							},
						]}
					/>
					<MnemonicGrid style={styles.mnemonic} mnemonic={mnemonic!} />
				</>
			)}
			<Button
				onPress={onOkPressed}
				mode="contained"
				labelStyle={styles.saveButton}
				disabled={generatingMnemonic}
			>
				{t('recovery passphrase saved')}
			</Button>
		</StyledSafeAreaView>
	);
}

const useStyles = makeStyle((theme) => ({
	root: {
		paddingTop: 0,
	},
	loadingView: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	saveMnemonicAdvice: {
		marginTop: theme.spacing.s,
	},
	mnemonic: {
		marginTop: theme.spacing.m,
		flex: 1,
	},
	wordsBtnContainer: {
		display: 'flex',
		flexDirection: 'row-reverse',
	},
	saveButton: {
		fontStyle: 'normal',
		textTransform: 'none',
	},
}));
