import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import useChangeAccount from 'hooks/useChangeAccount';
import useSetAccounts from 'hooks/useSetAccounts';
import { AccountCreationStackParams, RootStackParams } from 'types/navigation';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { WalletGenerationData } from 'types/wallet';
import { DPMImages } from 'types/images';
import useStyles from './useStyles';

export type GenerateAccountParams = {
  walletGenerationData: WalletGenerationData,
}

declare type NavProps = CompositeScreenProps<
  StackScreenProps<AccountCreationStackParams, 'GenerateAccount'>,
  StackScreenProps<RootStackParams, 'AccountCreationScreens'>
>;

const GenerateAccount = (props: NavProps) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [generating, setGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [account ] = useState<any | null>(null);
  const setAccounts = useSetAccounts();
  const changeAccount = useChangeAccount();

  const generateAccount = useCallback(async () => {
    setGenerating(true);
    setGenerating(false);
  }, []);

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
        <DpmImage style={styles.icon} source={DPMImages.Success} resizeMode="contain" />

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
