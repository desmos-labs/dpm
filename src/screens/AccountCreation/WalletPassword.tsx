import React, { useState } from 'react';
import { View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { AccountCreationStackParams } from '../../types/navigation';
import {
	StyledSafeAreaView,
	Button,
	Typography,
	PasswordComplexity,
	TopBar,
} from '../../components';
import { makeStyle } from '../../theming';
import { SecureTextInput } from '../../components/SecureTextInput';
import { PasswordComplexityScore } from '../../components/PasswordComplexityScore';

function evaluatePasswordComplexity(password: string): PasswordComplexityScore {
	const specialChars = '\\|!"£$%&/()=?^\'[]*+@#{}<>';
	if (password.length < 6) {
		return 0;
	}
	let uppercaseChars = 0;
	let numberChars = 0;
	let specialCharsCount = 0;

	for (let i = 0; i < password.length; i++) {
		if (!isNaN(Number(password[i]))) {
			numberChars++;
		} else if (specialChars.indexOf(password[i]) >= 0) {
			specialCharsCount++;
		} else if (password[i].toUpperCase() === password[i]) {
			uppercaseChars++;
		}
	}

	let score = 1;
	if (uppercaseChars > 0) {
		score++;
	}
	if (numberChars > 0) {
		score++;
	}
	if (specialCharsCount > 0) {
		score++;
	}

	return score as PasswordComplexityScore;
}

type CreatePasswordProps = StackScreenProps<
	AccountCreationStackParams,
	'CreateWalletPassword'
>;
type CheckPasswordProps = StackScreenProps<
	AccountCreationStackParams,
	'CheckWalletPassword'
>;
type Props = CreatePasswordProps | CheckPasswordProps;

export default function WalletPassword(props: Props): JSX.Element {
	const { navigation, route } = props;
	const { t } = useTranslation();
	const styles = useStyles();
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	// @ts-ignore
	const isCreatePassword = route.params.password === undefined;

	const onPasswordChange = (text: string) => {
		setPassword(text);
		setErrorMessage(null);
	};

	const onContinuePressed = () => {
		if (isCreatePassword) {
			if (evaluatePasswordComplexity(password) === 0) {
				setErrorMessage(t('password too short'));
				return;
			}
			navigation.navigate({
				name: 'CheckWalletPassword',
				params: {
					...route.params,
					password,
				},
			});
		} else {
			// @ts-ignore
			if (password !== route.params?.password) {
				setErrorMessage(t('wrong confirmation password'));
			} else {
				navigation.navigate({
					name: 'GenerateAccount',
					params: {
						wallet: route.params.wallet,
						password,
					},
				});
			}
		}
	};

	return (
		<StyledSafeAreaView
			style={styles.root}
			topBar={<TopBar stackProps={props} />}
		>
			<Typography.Title>{t('protect your wallet')}</Typography.Title>
			<Typography.Body>{t('add an extra security')}</Typography.Body>

			<View style={styles.passwordLabel}>
				<Typography.Body>
					{isCreatePassword
						? t('enter security password')
						: t('confirm security password')}
				</Typography.Body>

				{isCreatePassword && (
					<PasswordComplexity score={evaluatePasswordComplexity(password)} />
				)}
			</View>
			<SecureTextInput
				placeholder={t('password')}
				style={styles.password}
				value={password}
				onChangeText={onPasswordChange}
				onSubmitEditing={onContinuePressed}
				autoFocus
			/>
			{isCreatePassword && (
				<Typography.Body style={styles.passwordComplexityHint}>
					{t('password complexity hint')}.
				</Typography.Body>
			)}
			<Typography.Body style={styles.errorParagraph}>
				{errorMessage}
			</Typography.Body>
			<Button
				style={styles.continueButton}
				mode="contained"
				onPress={onContinuePressed}
			>
				{isCreatePassword ? t('next') : t('confirm')}
			</Button>
		</StyledSafeAreaView>
	);
}

const useStyles = makeStyle((theme) => ({
	root: {
		paddingTop: 0,
	},
	passwordLabel: {
		display: 'flex',
		flexDirection: 'row',
		marginTop: theme.spacing.m,
		alignItems: 'center',
		justifyContent: 'space-between',
	},
	password: {
		marginTop: theme.spacing.s,
	},
	passwordComplexityHint: {
		marginTop: theme.spacing.s,
	},
	continueButton: {
		marginTop: theme.spacing.s,
	},
	errorParagraph: {
		color: theme.colors.error,
		marginTop: theme.spacing.s,
		flexGrow: 1,
	},
}));
