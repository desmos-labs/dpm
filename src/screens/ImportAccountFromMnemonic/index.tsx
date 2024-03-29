import { EnglishMnemonic } from '@cosmjs/crypto';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { useRecoilValue } from 'recoil';
import useSelectAccounts from 'hooks/useSelectAccounts';
import importAccountAppState from '@recoil/importAccountState';
import DKeyboardAvoidingView from 'components/DKeyboardAvoidingView';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.IMPORT_ACCOUNT_FROM_MNEMONIC
>;

const ImportAccountFromMnemonic: FC<NavProps> = (props) => {
  const styles = useStyles();
  const { t } = useTranslation('account');

  // -------- HOOKS --------

  const selectAccounts = useSelectAccounts();
  const importAccountState = useRecoilValue(importAccountAppState);
  const { ignoreAddresses, selectedChain, onSuccess, allowMultiSelect } = importAccountState!;

  // -------- STATES --------

  const [mnemonic, setMnemonic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // -------- CALLBACKS --------

  const onMnemonicChange = React.useCallback((changedMnemonic: string) => {
    const sanitizedMnemonic = sanitizeMnemonic(changedMnemonic, true);
    setMnemonic(sanitizedMnemonic);
    setErrorMessage(null);
  }, []);

  const onNextPressed = useCallback(async () => {
    if (mnemonic === '') {
      setErrorMessage(t('empty recovery passphrase'));
    } else {
      const sanitizedMnemonic = sanitizeMnemonic(mnemonic);

      if (checkMnemonic(sanitizedMnemonic)) {
        selectAccounts(
          {
            mode: WalletPickerMode.Mnemonic,
            mnemonic: sanitizedMnemonic,
            masterHdPath: selectedChain!.masterHDPath,
            ignoreAddresses,
            addressPrefix: selectedChain!.prefix,
            allowCoinTypeEdit: false,
            allowMultiSelect,
          },
          {
            onSuccess: (accounts) => {
              onSuccess({ accounts, chain: selectedChain! });
            },
          },
        );
      } else {
        const invalidWords = sanitizedMnemonic
          .split(' ')
          .filter((w) => w.length > 0 && EnglishMnemonic.wordlist.indexOf(w) === -1)
          .join(', ');

        if (invalidWords.length > 0) {
          setErrorMessage(`${t('invalid words')}:\n${invalidWords}`);
        } else {
          setErrorMessage(t('invalid recovery passphrase'));
        }
      }
    }
  }, [mnemonic, t, selectAccounts, selectedChain, ignoreAddresses, allowMultiSelect, onSuccess]);

  const useDebugMnemonic = React.useCallback(() => {
    setMnemonic(
      'hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet',
    );
    setErrorMessage(null);
  }, []);

  return (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} />}
      touchableWithoutFeedbackDisabled={false}
    >
      <Typography.H5 capitalize>{t('import recovery passphrase')}</Typography.H5>
      <Typography.Body>{t('enter recovery passphrase')}.</Typography.Body>

      <Typography.Body style={styles.mnemonicInputLabel}>
        {t('recovery passphrase')}
      </Typography.Body>
      <TextInput
        style={styles.mnemonic}
        inputStyle={styles.mnemonicInput}
        textAlignVertical={'top'}
        placeholder={t('enter recovery passphrase placeholder')}
        value={mnemonic}
        multiline
        onChangeText={onMnemonicChange}
        blurOnSubmit
        autoFocus
        onSubmitEditing={onNextPressed}
        autoCapitalize="none"
        autoCorrect={false}
        error={errorMessage !== null}
      />

      {errorMessage !== null && (
        <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
      )}

      <Flexible.Padding flex={1} />
      <DKeyboardAvoidingView>
        {__DEV__ && (
          <Button style={styles.nextBtn} mode="contained" onPress={useDebugMnemonic}>
            Use debug mnemonic
          </Button>
        )}
        <Button mode="contained" onPress={onNextPressed}>
          {t('next')}
        </Button>
      </DKeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default ImportAccountFromMnemonic;
