import { EnglishMnemonic } from '@cosmjs/crypto';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Button, StyledSafeAreaView, TextInput, TopBar } from '../../components';
import { FlexPadding } from '../../components/FlexPadding';
import { makeStyle } from '../../theming';
import { ChainLinkScreensStackParams } from '../../types/navigation';
import sanitizeMnemonic from '../../utilils/mnemonic';
import { checkMnemonic } from '../../wallet/LocalWallet';
import { Typography } from '../../components/typography';

export type Props = StackScreenProps<ChainLinkScreensStackParams, 'LinkWithMnemonic'>;

export const LinkWithMnemonic: React.FC<Props> = ({ navigation, route }) => {
  const { importMode, chain, feeGranter, backAction } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const [mnemonic, setMnemonic] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
          name: 'PickAddress',
          params: {
            importMode,
            chain,
            mnemonic,
            feeGranter,
            backAction,
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
    setMnemonic('');
    setErrorMessage(null);
  };

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />}>
      <Typography.Body>
        <Trans
          i18nKey="enter chain recovery passphrase"
          components={{
            bold: <Typography.Subtitle />,
          }}
          values={{
            chain: chain.name,
          }}
        />
      </Typography.Body>

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
        <Button mode="contained" onPress={useDebugMnemonic}>
          Use debug mnemonic
        </Button>
      )}
      <Button mode="contained" onPress={onNextPressed}>
        {t('next')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
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
    marginBottom: theme.spacing.s,
    color: theme.colors.font.red,
  },
}));
