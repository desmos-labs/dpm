import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import Typography from 'components/Typography';
import _ from 'lodash';
import MnemonicWordBadge from 'components/MnemonicWordBadge';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletPickerMode } from 'screens/SelectAccount/components/AccountPicker/types';
import useSaveGeneratedAccount from 'hooks/useSaveGeneratedAccount';
import useSelectAccount from 'hooks/useSelectAccount';
import { DesmosHdPath } from 'config/HdPaths';
import { useStoredAccountsAddresses } from '@recoil/accounts';
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

  const words = useMemo(() => _.shuffle(receivedMnemonic.split(' ')), [receivedMnemonic]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...words]);

  const accountsAddresses = useStoredAccountsAddresses();
  const saveAccount = useSaveGeneratedAccount(false);
  const selectAccount = useSelectAccount();

  const onWordSelected = useCallback((word: string) => {
    setAvailableWords((currentAvailableWords) => {
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
        setAvailableWords((currentAvailableWords) => [...currentAvailableWords, word]);
        return newSelectedWords;
      }

      return currentSelectedWords;
    });
  }, []);

  const onCheckPressed = useCallback(async () => {
    if (selectedWords.length !== words.length) {
      setErrorMessage(t('invalid recovery passphrase'));
    } else {
      const composedMnemonic = selectedWords.join(' ');
      if (receivedMnemonic === composedMnemonic) {
        selectAccount(
          {
            mode: WalletPickerMode.Mnemonic,
            mnemonic,
            masterHdPath: DesmosHdPath,
            addressPrefix: 'desmos',
            allowCoinTypeEdit: false,
            ignoreAddresses: accountsAddresses,
          },
          {
            onSuccess: saveAccount,
          },
        );
      } else {
        setErrorMessage(t('invalid recovery passphrase'));
      }
    }
  }, [
    selectedWords,
    words.length,
    t,
    receivedMnemonic,
    selectAccount,
    mnemonic,
    accountsAddresses,
    saveAccount,
  ]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('confirm recovery passphrase')} />}
    >
      <Typography.Subtitle2>{t('select each word in order')}.</Typography.Subtitle2>

      <View style={styles.selectedWordsContainer}>
        {selectedWords.map((w, i) => (
          <MnemonicWordBadge
            style={styles.wordBadge}
            key={`${w}-${i * 2}`}
            value={w}
            onPress={onWordDeselected}
          />
        ))}
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

      <Typography.Body style={styles.errorParagraph}>{errorMessage}</Typography.Body>
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
