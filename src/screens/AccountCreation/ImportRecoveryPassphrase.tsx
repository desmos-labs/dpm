import React, { useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { EnglishMnemonic } from '@cosmjs/crypto';
import { AccountCreationStackParams } from '../../types/navigation';
import { checkMnemonic } from '../../wallet/LocalWallet';
import {
	Typography,
	TextInput,
	StyledSafeAreaView,
	Button,
	TopBar,
} from '../../components';
import { makeStyle } from '../../theming';
import { FlexPadding } from '../../components/FlexPadding';
import { sanitizeMnemonic } from '../../utilils/mnemonic';

declare type Props = StackScreenProps<
	AccountCreationStackParams,
	'ImportRecoveryPassphrase'
>;

export default function ImportRecoveryPassphrase(props: Props): JSX.Element {
	const styles = useStyles();
	const { t } = useTranslation();
	const [mnemonic, setMnemonic] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const { navigation } = props;

	const onMnemonicChange = (changedMnemonic: string) => {
		const sanitizedMnemonic = sanitizeMnemonic(changedMnemonic, {
			removeStartingSpaces: true,
			removeDoubleSpaces: true,
		});

		// Handle enter pressed
		if (sanitizedMnemonic.indexOf('\n') > 0) {
			onNextPressed();
		} else {
			setMnemonic(sanitizedMnemonic);
			setErrorMessage(null);
		}
	};

	const onNextPressed = () => {
		const sanitizedMnemonic = sanitizeMnemonic(mnemonic, {
			removeTrailingSpaces: true,
		});

		if (checkMnemonic(sanitizedMnemonic)) {
			navigation.navigate({
				name: 'PickDerivationPath',
				params: {
					mnemonic: sanitizedMnemonic,
				},
			});
		} else {
			const invalidWords = sanitizedMnemonic
				.split(' ')
				.filter((w) => {
					return w.length > 0 && EnglishMnemonic.wordlist.indexOf(w) === -1;
				})
				.join(',');

			if (invalidWords.length > 0) {
				setErrorMessage(`${t('invalid words')}:\n${invalidWords}`);
			} else {
				setErrorMessage(t('invalid recovery passphrase'));
			}
		}
	};

	const useDebugMnemonic = () => {
		setMnemonic(
			'hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet'
		);
		setErrorMessage(null);
	};

	return (
		<StyledSafeAreaView
			style={styles.root}
			topBar={<TopBar stackProps={props} />}
		>
			<Typography.Title>{t('import recovery passphrase')}</Typography.Title>
			<Typography.Body>{t('enter recovery passphrase')}.</Typography.Body>

			<Typography.Body style={styles.mnemonicInputLabel}>
				{t('recovery passphrase')}
			</Typography.Body>
			<TextInput
				style={styles.mnemonicInput}
				placeholder={t('enter recovery passphrase placeholder')}
				value={mnemonic}
				multiline
				onChangeText={onMnemonicChange}
				autoFocus
			/>

			{errorMessage !== null && (
				<Typography.Body style={styles.errorParagraph}>
					{errorMessage}
				</Typography.Body>
			)}

			<FlexPadding flex={1} />

			{__DEV__ && (
				<Button
					style={styles.bottomBtn}
					mode="contained"
					onPress={useDebugMnemonic}
				>
					Use debug mnemonic
				</Button>
			)}
			<Button mode="contained" onPress={onNextPressed}>
				{t('next')}
			</Button>
		</StyledSafeAreaView>
	);
}

const useStyles = makeStyle((theme) => ({
	root: {
		paddingTop: 0,
	},
	mnemonicInputLabel: {
		marginTop: theme.spacing.l,
		textTransform: 'capitalize',
	},
	mnemonicInput: {
		marginTop: theme.spacing.s,
		minHeight: 150,
	},
	advanceSettingsBtn: {
		marginTop: theme.spacing.s,
	},
	errorParagraph: {
		marginBottom: theme.spacing.s,
		color: theme.colors.font.red,
	},
	bottomBtn: {
		marginVertical: theme.spacing.s,
	},
}));
