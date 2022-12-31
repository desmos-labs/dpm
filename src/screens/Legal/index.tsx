import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import Padding from 'components/Flexible/Padding';
import Flexible from 'components/Flexible';
import Typography from 'components/Typography';
import { DesmosLedgerApp } from 'types/ledger';
import { AccountCreationStackParams, RootStackParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import useStyles from './useStyles';

type Props = CompositeScreenProps<
  StackScreenProps<AccountCreationStackParams, 'Legal'>,
  StackScreenProps<RootStackParams>
>;

const Legal: React.FC<Props> = (props) => {
  const {
    navigation,
    route: {
      params: { mode },
    },
  } = props;
  const { t } = useTranslation();
  const styles = useStyles();

  const openTermsOfService = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('terms of service'),
        asset: 'terms-of-service.md',
      },
    });
  }, [navigation, t]);

  const openPrivacyPolicy = useCallback(async () => {
    navigation.navigate({
      name: 'MarkdownText',
      params: {
        title: t('privacy policy'),
        asset: 'custom/privacy.md',
      },
    });
  }, [navigation, t]);

  const onAccepted = useCallback(() => {
    if (mode === 'create') {
      navigation.navigate({
        name: 'GenerateNewMnemonic',
        params: undefined,
      });
    } else if (mode === 'import') {
      navigation.navigate({
        name: 'ImportRecoveryPassphrase',
        params: undefined,
      });
    } else if (mode === 'ledger') {
      navigation.navigate({
        name: 'ConnectToLedgerScreens',
        params: {
          ledgerApp: DesmosLedgerApp,
          onConnectionEstablished: (transport: BluetoothTransport) => {
            navigation.navigate({
              name: 'PickDerivationPath',
              params: {
                ledgerTransport: transport,
              },
            });
          },
        },
      });
    }
  }, [navigation, mode]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={<TopBar style={styles.background} stackProps={props} />}
    >
      <Typography.Title style={styles.title}>{t('legal')}</Typography.Title>

      <Typography.Body>
        {t('please review the desmos profile manager terms of service and privacy policy')}.
      </Typography.Body>
      <Flexible.Section style={styles.section}>
        <Flexible.SectionButton label={t('terms of service')} onPress={openTermsOfService} />
        <Flexible.SectionButton label={t('privacy policy')} onPress={openPrivacyPolicy} />
      </Flexible.Section>
      <Padding flex={1} />
      <Button onPress={onAccepted} mode="contained">
        {t('accept')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default Legal;
