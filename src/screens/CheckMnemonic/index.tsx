import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { AccountCreationStackParams } from 'types/navigation';
import Typography from 'components/Typography';
import _ from 'lodash';
import MnemonicWordBadge from 'components/MnemonicWordBadge';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import useStyles from './useStyles';

declare type Props = StackScreenProps<AccountCreationStackParams, 'CheckMnemonic'>;

const CheckMnemonic = (props: Props) => {
  const {
    route: {
      params: { mnemonic },
    },
    navigation,
  } = props;
  const styles = useStyles();
  const { t } = useTranslation();
  const receivedMnemonic = mnemonic;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const words = useMemo(() => _.shuffle(receivedMnemonic.split(' ')), [receivedMnemonic]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [availableWords, setAvailableWords] = useState<string[]>([...words]);

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

  const onCheckPressed = useCallback(() => {
    if (selectedWords.length !== words.length) {
      setErrorMessage(t('invalid recovery passphrase'));
    } else {
      const composedMnemonic = selectedWords.join(' ');
      if (receivedMnemonic === composedMnemonic) {
        navigation.navigate({
          name: 'PickDerivationPath',
          params: {
            mnemonic: composedMnemonic,
          },
        });
      } else {
        setErrorMessage(t('invalid recovery passphrase'));
      }
    }
  }, [navigation, receivedMnemonic, selectedWords, t, words.length]);

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
