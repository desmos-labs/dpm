import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ChainLinkScreensStackParams } from 'types/navigation';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ImageButton from './components/ImageButton';
import useStyles from './useStyles';

export type Props = StackScreenProps<ChainLinkScreensStackParams, 'ConnectChain'>;

const ConnectChain: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { backAction, feeGranter } = route.params;

  const connectWithMnemonic = useCallback(() => {

  }, [navigation, backAction, feeGranter]);

  const connectWithLedger = useCallback(() => {

  }, [navigation, backAction]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('connect chain')} />
      }
    >
      <Typography.Body>{t('select connection method')}</Typography.Body>

      <ImageButton
        style={styles.topMargin}
        image="connect-mnemonic"
        label={t('use secret recovery passphrase')}
        onPress={connectWithMnemonic}
      />

      <ImageButton
        style={[styles.topMargin]}
        image="connect-ledger"
        label={t('connect with ledger')}
        onPress={connectWithLedger}
      />
    </StyledSafeAreaView>
  );
};

export default ConnectChain;
