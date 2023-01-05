import { EnglishMnemonic } from '@cosmjs/crypto';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform } from 'react-native';
import Flexible from 'components/Flexible';
import Typography from 'components/Typography';
import { checkMnemonic } from 'lib/WalletUtils/mnemonic';
import { sanitizeMnemonic } from 'lib/FormatUtils';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import TextInput from 'components/TextInput';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {
  WalletPickerMnemonicParams,
  WalletPickerMode,
} from 'screens/SelectAddress/components/AccountPicker/types';
import { DesmosHdPath } from 'types/chainsHdPaths';
import { useRecoilValue } from 'recoil';
import { accountsHdPathsAppState } from '@recoil/accounts';
import { Wallet } from 'types/wallet';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.IMPORT_RECOVERY_PASSPHRASE>;

const ImportRecoveryPassphrase: FC<NavProps> = (props) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { navigation } = props;
  const accountsHdPaths = useRecoilValue(accountsHdPathsAppState);

  const onMnemonicChange = (changedMnemonic: string) => {
    const sanitizedMnemonic = sanitizeMnemonic(changedMnemonic);

    // Handle enter pressed
    if (sanitizedMnemonic.indexOf('\n') > 0) {
      onNextPressed();
    } else {
      setMnemonic(sanitizedMnemonic);
      setErrorMessage(null);
    }
  };

  const onNextPressed = () => {
    if (mnemonic === '') {
      setErrorMessage(t('empty recovery passphrase'));
    } else {
      const sanitizedMnemonic = sanitizeMnemonic(mnemonic);

      if (checkMnemonic(sanitizedMnemonic)) {
        navigation.navigate({
          name: ROUTES.SELECT_ACCOUNT,
          params: {
            walletPickerParams: {
              mode: WalletPickerMode.Mnemonic,
              mnemonic,
              masterHdPath: DesmosHdPath,
              addressPrefix: 'desmos',
              allowCoinTypeEdit: false,
              ignorePaths: accountsHdPaths,
            } as WalletPickerMnemonicParams,
            onSelect: (wallet: Wallet) => {
              // TODO: Navigate to the check password screen if
              // the user have already created an account.
              navigation.navigate({
                name: ROUTES.CREATE_WALLET_PASSWORD,
                params: {
                  wallet,
                },
              });
            },
          },
        });
      } else {
        const invalidWords = sanitizedMnemonic
          .split(' ')
          .filter((w) => w.length > 0 && EnglishMnemonic.wordlist.indexOf(w) === -1)
          .join(',');

        if (invalidWords.length > 0) {
          setErrorMessage(`${t('invalid words')}:\n${invalidWords}`);
        } else {
          setErrorMessage(t('invalid recovery passphrase'));
        }
      }
    }
  };

  const useDebugTestnetMnemonic = () => {
    setMnemonic('');
    setErrorMessage(null);
  };

  const useDebugMainnetMnemonic = () => {
    setMnemonic('');
    setErrorMessage(null);
  };

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
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
        <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      )}

      <Flexible.Padding flex={1} />
      <KeyboardAvoidingView
        keyboardVerticalOffset={Platform.OS === 'ios' ? 110 : 0}
        {...(Platform.OS === 'ios' ? { behavior: 'padding' } : {})}
      >
        {__DEV__ && (
          <Button style={styles.nextBtn} mode="contained" onPress={useDebugTestnetMnemonic}>
            Use testnet debug mnemonic
          </Button>
        )}
        {__DEV__ && (
          <Button style={styles.nextBtn} mode="contained" onPress={useDebugMainnetMnemonic}>
            Use mainnet debug mnemonic
          </Button>
        )}
        <Button mode="contained" onPress={onNextPressed}>
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default ImportRecoveryPassphrase;
