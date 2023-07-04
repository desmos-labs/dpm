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
import { delay } from 'lib/PromiseUtils';
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

  const isFirstGeneration = React.useRef(true);
  const [mnemonic, setMnemonic] = useState<string | null>(null);
  const generatingMnemonic = React.useMemo(() => mnemonic === null, [mnemonic]);

  const generateMnemonic = useCallback(async (length: 12 | 24) => {
    if (isFirstGeneration.current) {
      await delay(1500);
      isFirstGeneration.current = false;
    }
    return randomMnemonic(length);
  }, []);

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
    <StyledSafeAreaView topBar={<TopBar stackProps={props} />}>
      <Typography.H5 capitalize>{t('secret recovery passphrase')}</Typography.H5>
      <Typography.Regular16 style={styles.saveMnemonicAdvice}>
        <Trans
          ns="account"
          i18nKey="save recovery passphrase"
          components={{
            bold: <Typography.Subtitle style={styles.saveMnemonicAdviceSubtitle} />,
          }}
        />
      </Typography.Regular16>

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
