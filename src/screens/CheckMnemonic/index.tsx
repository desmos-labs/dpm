import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import MnemonicWordBadge from 'components/MnemonicWordBadge';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import useSaveGeneratedAccounts from 'hooks/useSaveGeneratedAccounts';
import useSelectAccounts from 'hooks/useSelectAccounts';
import { DesmosHdPath } from 'config/HdPaths';
import { useStoredAccountsAddresses } from '@recoil/accounts';
import Flexible from 'components/Flexible';
import ErrorMessage from 'components/ErrorMessage';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CHECK_MNEMONIC>;

export type CheckMnemonicParams = {
  mnemonic: string;
};

const CheckMnemonic: FC<NavProps> = (props) => {
  const {
    route: {
      params: { mnemonic },
    },
  } = props;
  const styles = useStyles();
  const { t } = useTranslation('account');

  const receivedMnemonic = mnemonic;
  const words = useMemo(() => receivedMnemonic.split(' ').sort(), [receivedMnemonic]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...words]);

  const accountsAddresses = useStoredAccountsAddresses();
  const saveAccounts = useSaveGeneratedAccounts(false);
  const selectAccounts = useSelectAccounts();

  const onWordSelected = useCallback((word: string) => {
    setAvailableWords((currentAvailableWords) => {
      setErrorMessage(null);
      const removeIndex = currentAvailableWords.indexOf(word);
      if (removeIndex >= 0) {
        const newAvailableWords = [...currentAvailableWords];
        newAvailableWords.splice(removeIndex, 1);
        setSelectedWords((currentSelectedWords) => [...currentSelectedWords, word]);
        return newAvailableWords;
      }
      return currentAvailableWords;
    });
  }, []);

  const onWordDeselected = useCallback((word: string) => {
    setSelectedWords((currentSelectedWords) => {
      const removeIndex = currentSelectedWords.indexOf(word);
      setErrorMessage(null);
      if (removeIndex >= 0) {
        const newSelectedWords = [...currentSelectedWords];
        newSelectedWords.splice(removeIndex, 1);
        setAvailableWords((currentAvailableWords) => [...currentAvailableWords, word].sort());
        return newSelectedWords;
      }

      return currentSelectedWords;
    });
  }, []);

  const onCheckPressed = useCallback(async () => {
    if (selectedWords.length !== words.length) {
      setErrorMessage(t('invalid recovery passphrase order'));
    } else {
      const composedMnemonic = selectedWords.join(' ');
      if (receivedMnemonic === composedMnemonic) {
        selectAccounts(
          {
            mode: WalletPickerMode.Mnemonic,
            mnemonic,
            masterHdPath: DesmosHdPath,
            addressPrefix: 'desmos',
            allowCoinTypeEdit: false,
            ignoreAddresses: accountsAddresses,
            allowMultiSelect: true,
          },
          {
            onSuccess: saveAccounts,
          },
        );
      } else {
        setErrorMessage(t('invalid recovery passphrase order'));
      }
    }
  }, [
    selectedWords,
    words.length,
    t,
    receivedMnemonic,
    selectAccounts,
    mnemonic,
    accountsAddresses,
    saveAccounts,
  ]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />} scrollable={false}>
      <Typography.H5>{t('confirm recovery passphrase')}</Typography.H5>
      <Typography.Regular16>{t('select each word in order')}.</Typography.Regular16>

      <View
        style={[
          styles.selectedWordsContainer,
          errorMessage ? styles.selectedWordsContainerError : undefined,
        ]}
      >
        <View style={styles.selectedWords}>
          {selectedWords.map((w, i) => (
            <MnemonicWordBadge
              style={styles.wordBadge}
              key={`${w}-${i * 2}`}
              value={w}
              onPress={onWordDeselected}
            />
          ))}
        </View>
      </View>

      <View style={styles.availableWordsContainer}>
        {availableWords.map((w, i) => (
          <MnemonicWordBadge
            style={styles.wordBadge}
            key={`${w}-${i * 2}`}
            value={w}
            onPress={onWordSelected}
          />
        ))}
      </View>

      <ErrorMessage message={errorMessage} />

      <Flexible.Padding flex={1} />

      <Button onPress={onCheckPressed} mode="contained">
        {t('check')}
      </Button>
      {__DEV__ && (
        <Button
          onPress={() => {
            setAvailableWords([]);
            setSelectedWords(mnemonic.split(' '));
          }}
          mode="contained"
        >
          (DBG) Auto sort
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

export default CheckMnemonic;
