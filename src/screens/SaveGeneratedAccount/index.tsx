import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { AccountWithWallet } from 'types/account';
import { useSaveAccount } from 'screens/SaveGeneratedAccount/useHooks';
import { DPMImages } from 'types/images';
import { useSetActiveAccountAddress } from '@recoil/activeAccount';
import useStyles from './useStyles';

export type SaveGeneratedAccountParams = {
  account: AccountWithWallet;
  password: string;
};

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SAVE_GENERATED_ACCOUNT>;

const SaveGeneratedAccount = (props: NavProps) => {
  const { t } = useTranslation('account');
  const styles = useStyles();

  const { navigation } = props;
  const { account, password } = props.route.params;

  const setActiveAccountAddress = useSetActiveAccountAddress();
  const { savingAccount, saveAccount, saveAccountError } = useSaveAccount();

  const generateAccount = useCallback(async () => {
    await saveAccount(account, password);
    setActiveAccountAddress(account.account.address);
  }, [account, password, saveAccount, setActiveAccountAddress]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (!__DEV__ && e.data.action.type !== 'RESET') {
          e.preventDefault();
        }
      }),
    [navigation],
  );

  useEffect(() => {
    generateAccount().then(() => {});

    // Fine to ignore the hook deps since we just need to lunch
    // generate account when opening this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onContinuePressed = useCallback(() => {
    navigation.reset({
      index: 0,
      routes: [{ name: ROUTES.HOME_TABS }],
    });
  }, [navigation]);

  const generatedAccount =
    !savingAccount && saveAccountError === undefined ? (
      <>
        <DpmImage style={styles.icon} source={DPMImages.Success} resizeMode="contain" />

        <Typography.Title>{t('common:success')}</Typography.Title>
        <Typography.Body1>{t('account created')}</Typography.Body1>

        <Button style={styles.continueButton} mode="contained" onPress={onContinuePressed}>
          {t('continue')}
        </Button>
      </>
    ) : (
      <>
        <Typography.Body style={styles.errorText}>{t('error generating account')}</Typography.Body>
        <Typography.Body style={styles.errorText}>{saveAccountError}</Typography.Body>
      </>
    );

  return (
    <StyledSafeAreaView style={styles.root}>
      {savingAccount ? (
        <Typography.Title style={styles.generatingText}>
          {t('generating account')}...
        </Typography.Title>
      ) : (
        generatedAccount
      )}
    </StyledSafeAreaView>
  );
};

export default SaveGeneratedAccount;
