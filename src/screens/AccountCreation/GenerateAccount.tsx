import React, { useCallback, useEffect, useState } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { CompositeScreenProps } from '@react-navigation/native';
import {
	AccountCreationStackParams,
	RootStackParams,
} from '../../types/navigation';
import { ChainAccount, ChainAccountType } from '../../types/chain';
import useSaveWallet from '../../hooks/useSaveWallet';
import useSaveAccount from '../../hooks/useSaveAccount';
import {
	Button,
	DpmImage,
	StyledSafeAreaView,
	Typography,
} from '../../components';
import { makeStyle } from '../../theming';
import useChangeAccount from '../../hooks/useChangeAccount';
import useSaveSelectedAccount from '../../hooks/useSaveSelectedAccount';
import useSetAccounts from '../../hooks/useSetAccounts';
import { WalletType } from '../../types/wallet';
import * as SecureStorage from '../../utilils/SecureStorage';

declare type Props = CompositeScreenProps<
	StackScreenProps<AccountCreationStackParams, 'GenerateAccount'>,
	StackScreenProps<RootStackParams, 'AccountCreationScreens'>
>;

export default function GenerateAccount(props: Props): JSX.Element {
	const {
		navigation,
		route: {
			params: { wallet, password },
		},
	} = props;
	const { t } = useTranslation();
	const styles = useStyles();
	const [generating, setGenerating] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [account, setAccount] = useState<ChainAccount | null>(null);
	const setAccounts = useSetAccounts();
	const saveWallet = useSaveWallet();
	const saveAccount = useSaveAccount();
	const saveSelectedAccount = useSaveSelectedAccount();
	const changeAccount = useChangeAccount();

	const generateAccount = useCallback(async () => {
		setGenerating(true);
		try {
			if (wallet.type === WalletType.Mnemonic) {
				await saveWallet(wallet.localWallet, password);
			}
			const accountToSave: ChainAccount = {
				type:
					wallet.type === WalletType.Mnemonic
						? ChainAccountType.Local
						: ChainAccountType.Ledger,
				address: wallet.address,
				hdPath: wallet.hdPath,
				pubKey: wallet.pubKey,
				signAlgorithm: wallet.signAlgorithm,
			};
			await saveAccount(accountToSave);
			await saveSelectedAccount(accountToSave);
			// Save a secret encrypted with user provided password to
			// authenticate the user when performing sensitive operations.
			await SecureStorage.setItem(
				`${accountToSave.address}-auth-challenge`,
				accountToSave.address,
				{
					password,
				}
			);
			setAccount(account);
		} catch (e) {
			setError(e.toString());
		}
		setGenerating(false);
	}, [saveWallet, wallet, account, password, saveAccount, saveSelectedAccount]);

	const onContinuePressed = useCallback(() => {
		if (account) {
			setAccounts((old) => [...old, account]);
			changeAccount(account);
		} else {
			// FIXME throw error message
		}
	}, [account, setAccounts, changeAccount]);

	useEffect(() => {
		return navigation.addListener('beforeRemove', (e) => {
			if (e.data.action.type !== 'RESET') {
				e.preventDefault();
			}
		});
	}, [navigation]);

	useEffect(() => {
		generateAccount().then(() => {});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<StyledSafeAreaView style={styles.root}>
			{generating ? (
				<Typography.Title style={styles.generatingText}>
					{t('generating account')}...
				</Typography.Title>
			) : account !== null ? (
				<>
					<DpmImage style={styles.icon} source="success" resizeMode="contain" />

					<Typography.Title>{t('success')}</Typography.Title>
					<Typography.Body1>{t('account created')}</Typography.Body1>

					<Button
						style={styles.continueButton}
						mode="contained"
						onPress={onContinuePressed}
					>
						{t('continue')}
					</Button>
					{__DEV__ && (
						<Button mode="contained" onPress={() => generateAccount()}>
							(DBG) Regenerate keys
						</Button>
					)}
				</>
			) : (
				<>
					<Typography.Body style={styles.errorText}>
						{t('error generating account')}
					</Typography.Body>
					<Typography.Body style={styles.errorText}>{error}</Typography.Body>
				</>
			)}
		</StyledSafeAreaView>
	);
}

const useStyles = makeStyle((theme) => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
	},
	generatingText: {},
	icon: {
		height: 180,
	},
	continueButton: {
		alignSelf: 'auto',
		marginVertical: theme.spacing.s,
	},
	errorText: {
		color: theme.colors.error,
	},
}));
