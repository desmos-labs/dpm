import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { ActivityIndicator, View } from 'react-native';
import { randomMnemonic } from 'lib/WalletUtils/mnemonic';
import Typography from 'components/Typography';
import Button from 'components/Button';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import MnemonicGrid from './components/MnemonicGrid';
import InlineButton from './components/InlineButton';
import useStyles from './useStyles';

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_NEW_MNEMONIC>;

const CreateNewMnemonic: FC<NavProps> = (props) => {
  const { navigation } = props;
  const styles = useStyles();
  const { t } = useTranslation('account');

  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const [mnemonicLength, setMnemonicLength] = useState<12 | 24>(24);
  const [generationDelay, setGenerationDelay] = useState(1500);
  const generatingMnemonic = mnemonic === null;

  const generateMnemonic = useCallback(
    async (length: 12 | 24) => {
      if (generationDelay > 0) {
        return new Promise<string>((resolve) => {
          setTimeout(() => {
            resolve(randomMnemonic(length));
          }, generationDelay);
          setGenerationDelay(0);
        });
      }
      return randomMnemonic(length);
    },
    [generationDelay],
  );

  const changeMnemonicLength = useCallback(
    async (newLength: 12 | 24) => {
      setMnemonicLength(newLength);
      setMnemonic(null);
      const newMnemonic = await generateMnemonic(newLength);
      setMnemonic(newMnemonic);
    },
    [generateMnemonic],
  );

  // Hook to launch the generation when the user enter on the screen
  useEffect(() => {
    generateMnemonic(mnemonicLength).then(setMnemonic);
  }, [generateMnemonic, mnemonicLength]);

  const onOkPressed = useCallback(() => {
    if (mnemonic !== null) {
      navigation.navigate(ROUTES.CHECK_MNEMONIC, {
        mnemonic,
      });
    }
  }, [navigation, mnemonic]);

  return (
    <StyledSafeAreaView style={styles.root} topBar={<TopBar stackProps={props} />}>
      <Typography.Title>{t('secret recovery passphrase')}</Typography.Title>
      <Typography.Subtitle style={styles.saveMnemonicAdvice}>
        <Trans
          i18nKey="save recovery passphrase"
          components={{
            bold: <Typography.Subtitle style={styles.saveMnemonicAdviceSubtitle} />,
          }}
        />
      </Typography.Subtitle>

      {generatingMnemonic ? (
        <View style={styles.loadingView}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <>
          <InlineButton
            selected={mnemonicLength === 24 ? 0 : 1}
            buttons={[
              {
                label: `24 ${t('words')}`,
                onPress: () => changeMnemonicLength(24),
              },
              {
                label: `12 ${t('words')}`,
                onPress: () => changeMnemonicLength(12),
              },
            ]}
          />
          <MnemonicGrid style={styles.mnemonic} mnemonic={mnemonic!} />
        </>
      )}
      <Button
        onPress={onOkPressed}
        mode="contained"
        labelStyle={styles.saveButton}
        disabled={generatingMnemonic}
      >
        {t('recovery passphrase saved')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default CreateNewMnemonic;
