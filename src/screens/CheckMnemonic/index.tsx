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
import { useGetAccountsAddresses } from '@recoil/accounts';
import useSaveAccount from 'hooks/useSaveAccount';
import useSelectAccount from 'hooks/useSelectAccount';
import { DesmosHdPath } from 'config/HdPaths';
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

  const accountsAddresses = useGetAccountsAddresses();
  const saveAccount = useSaveAccount();
  const selectAccount = useSelectAccount();

  const onWordSelected = useCallback(
    (word: string) => {
      const removeIndex = availableWords.indexOf(word);
      if (removeIndex >= 0) {
        availableWords.splice(removeIndex, 1);
        setAvailableWords(availableWords);
        setSelectedWords([...selectedWords, word]);
      }
    },
    [availableWords, selectedWords],
  );

  const onWordDeselected = useCallback(
    (word: string) => {
      const removeIndex = selectedWords.indexOf(word);
      setErrorMessage(null);
      if (removeIndex >= 0) {
        selectedWords.splice(removeIndex, 1);
        setSelectedWords(selectedWords);
        setAvailableWords([...availableWords, word]);
      }
    },
    [availableWords, selectedWords],
  );

  const onCheckPressed = useCallback(async () => {
    if (selectedWords.length !== words.length) {
      setErrorMessage(t('invalid recovery passphrase'));
    } else {
      const composedMnemonic = selectedWords.join(' ');
      if (receivedMnemonic === composedMnemonic) {
        const account = await selectAccount({
          mode: WalletPickerMode.Mnemonic,
          mnemonic,
          masterHdPath: DesmosHdPath,
          addressPrefix: 'desmos',
          allowCoinTypeEdit: false,
          ignoreAddresses: accountsAddresses,
        });

        if (account !== undefined) {
          saveAccount(account);
        }
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
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('confirm recovery passphrase')}</Typography.Title>
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
