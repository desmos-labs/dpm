import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { randomMnemonic } from 'lib/WalletUtils/mnemonic';
import Typography from 'components/Typography';
import Button from 'components/Button';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import MnemonicGrid from './components/MnemonicGrid';
import useStyles from './useStyles';

export interface CreateNewMnemonicParams {
  /**
   * Length of the mnemonic to generate.
   */
  readonly length: 12 | 24;
}

declare type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CREATE_NEW_MNEMONIC>;

const CreateNewMnemonic: FC<NavProps> = (props) => {
  const { navigation } = props;
  const { length: mnemonicLength } = props.route.params;
  const styles = useStyles();
  const { t } = useTranslation('account');

  const [mnemonic, setMnemonic] = useState<string | null>(null);
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
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar stackProps={props} title={t('secret recovery passphrase')} />}
    >
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
          <StyledActivityIndicator />
        </View>
      ) : (
        <MnemonicGrid style={styles.mnemonic} mnemonic={mnemonic!} />
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
