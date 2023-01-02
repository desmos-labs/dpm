import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import useAppContext from 'contexts/AppContext';
import useChangeAccount from 'hooks/useChangeAccount';
import useSaveAccount from 'hooks/useSaveAccount';
import useSaveSelectedAccount from 'hooks/useSaveSelectedAccount';
import useSaveWallet from 'hooks/useSaveWallet';
import useSetAccounts from 'hooks/useSetAccounts';
import { ChainAccount, ChainAccountType } from 'types/chains';
import { AccountCreationStackParams, RootStackParams } from 'types/navigation';
import { WalletType } from 'types/wallet';
import * as SecureStorage from 'lib/SecureStorage';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import useStyles from './useStyles';

declare type Props = CompositeScreenProps<
  StackScreenProps<AccountCreationStackParams, 'GenerateAccount'>,
  StackScreenProps<RootStackParams, 'AccountCreationScreens'>
>;

const GenerateAccount = (props: Props) => {
  const { navigation, route } = props;
  const { wallet, password } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account, setAccount] = useState<ChainAccount | null>(null);
  const { accounts } = useAppContext();
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
      const accountToGenerate: ChainAccount = {
        type:
          wallet.type === WalletType.Mnemonic ? ChainAccountType.Local : ChainAccountType.Ledger,
        address: wallet.address,
        hdPath: wallet.hdPath,
        pubKey: wallet.pubKey,
        signAlgorithm: wallet.signAlgorithm,
      };
      await saveAccount(accountToGenerate);
      await saveSelectedAccount(accountToGenerate);
      // Save a string encrypted with user provided password to
      // authenticate the user when performing sensitive operations.
      if (accounts.length === 0) {
        await SecureStorage.setItem('dpm_global_password', 'dpm_global_password', {
          password,
        });
      }
      setAccount(accountToGenerate);
    } catch (e) {
      setError(e.toString());
    }
    setGenerating(false);
  }, [
    wallet.type,
    wallet.address,
    wallet.hdPath,
    wallet.pubKey,
    wallet.signAlgorithm,
    saveAccount,
    saveSelectedAccount,
    accounts.length,
    saveWallet,
    password,
  ]);

  const onContinuePressed = useCallback(() => {
    if (account) {
      setAccounts((old) => [...old, account]);
      changeAccount(account);
    } else {
      setError('error');
    }
  }, [account, setAccounts, changeAccount]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type !== 'RESET') {
          e.preventDefault();
        }
      }),
    [navigation],
  );

  useEffect(() => {
    generateAccount().then(() => {});
  }, []);

  const generatedAccount =
    account !== null ? (
      <>
        <DpmImage style={styles.icon} source="success" resizeMode="contain" />

        <Typography.Title>{t('success')}</Typography.Title>
        <Typography.Body1>{t('account created')}</Typography.Body1>

        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
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
        <Typography.Body style={styles.errorText}>{t('error generating account')}</Typography.Body>
        <Typography.Body style={styles.errorText}>{error}</Typography.Body>
      </>
    );

  return (
    <StyledSafeAreaView style={styles.root}>
      {generating ? (
        <Typography.Title style={styles.generatingText}>
          {t('generating account')}...
        </Typography.Title>
      ) : (
        generatedAccount
      )}
    </StyledSafeAreaView>
  );
};

export default GenerateAccount;
