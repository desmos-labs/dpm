import { EnglishMnemonic, HdPath } from '@cosmjs/crypto';
import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useState } from 'react';
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
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import { AccountWithWallet } from 'types/account';
import useStyles from './useStyles';

export interface CreateAccountFromMnemonicParams {
  readonly masterHdPath: HdPath;
  readonly addressPrefix: string;
  readonly allowCoinTypeEdit: boolean;
  readonly ignorePaths?: HdPath[];
  readonly onSelect: (account: AccountWithWallet) => any;
  readonly onCancel?: () => any;
}

declare type NavProps = StackScreenProps<
  RootNavigatorParamList,
  ROUTES.CREATE_ACCOUNT_FROM_MNEMONIC
>;

const CreateAccountFromMnemonic: FC<NavProps> = (props) => {
  const { masterHdPath, addressPrefix, allowCoinTypeEdit, ignorePaths, onSelect, onCancel } =
    props.route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { navigation } = props;

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

  const onNextPressed = useCallback(() => {
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
              masterHdPath,
              addressPrefix,
              allowCoinTypeEdit,
              ignorePaths,
            },
            onSelect,
            onCancel,
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
  }, [mnemonic, masterHdPath, addressPrefix, allowCoinTypeEdit, ignorePaths]);

  const useDebugMnemonic = () => {
    setMnemonic(
      'hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet',
    );
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
          <Button style={styles.nextBtn} mode="contained" onPress={useDebugMnemonic}>
            Use debug mnemonic
          </Button>
        )}
        <Button mode="contained" onPress={onNextPressed}>
          {t('next')}
        </Button>
      </KeyboardAvoidingView>
    </StyledSafeAreaView>
  );
};

export default CreateAccountFromMnemonic;
