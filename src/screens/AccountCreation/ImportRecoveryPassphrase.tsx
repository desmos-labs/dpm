import { EnglishMnemonic } from '@cosmjs/crypto';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, StyledSafeAreaView, TextInput, TopBar } from '../../components';
import { FlexPadding } from '../../components/FlexPadding';
import { makeStyle } from '../../theming';
import { AccountCreationStackParams } from '../../types/navigation';
import sanitizeMnemonic from '../../utilils/mnemonic';
import { checkMnemonic } from '../../wallet/LocalWallet';
import { Typography } from '../../components/typography';

declare type Props = StackScreenProps<AccountCreationStackParams, 'ImportRecoveryPassphrase'>;

export default function ImportRecoveryPassphrase(props: Props): JSX.Element {
  const styles = useStyles();
  const { t } = useTranslation();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { navigation } = props;

  const onMnemonicChange = (changedMnemonic: string) => {
    const sanitizedMnemonic = sanitizeMnemonic(changedMnemonic, {
      removeStartingSpaces: true,
      removeDoubleSpaces: true,
    });

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
      const sanitizedMnemonic = sanitizeMnemonic(mnemonic, {
        removeTrailingSpaces: true,
      });

      if (checkMnemonic(sanitizedMnemonic)) {
        navigation.navigate({
          name: 'PickDerivationPath',
          params: {
            mnemonic: sanitizedMnemonic,
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

  const useDebugMnemonic = () => {
    /*		setMnemonic(
			'hour harbor fame unaware bunker junk garment decrease federal vicious island smile warrior fame right suit portion skate analyst multiply magnet medal fresh sweet'
		); */
    setMnemonic(
      'verb pizza view holiday flip make silk marine buzz fiscal finger aunt document hood giant cheese embark visual first dirt camera fabric drill predict'
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

      <FlexPadding flex={1} />

      {__DEV__ && (
        <Button style={styles.nextBtn} mode="contained" onPress={useDebugMnemonic}>
          Use debug mnemonic
        </Button>
      )}
      <Button mode="contained" onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
}

const useStyles = makeStyle((theme) => ({
  root: {
    paddingTop: 0,
  },
  mnemonicInputLabel: {
    marginTop: theme.spacing.l,
    textTransform: 'capitalize',
  },
  mnemonicInput: {
    marginTop: theme.spacing.s,
    minHeight: 150,
  },
  advanceSettingsBtn: {
    marginTop: theme.spacing.s,
  },
  errorParagraph: {
    marginBottom: theme.spacing.xs,
    color: theme.colors.font.red,
  },
  nextBtn: {
    marginVertical: theme.spacing.xs,
  },
}));
