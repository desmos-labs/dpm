import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Flexible from 'components/Flexible';
import Button from 'components/Button';
import { BLELedger, LedgerApp, LedgerErrorType } from 'types/ledger';
import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { DPMAnimations, DPMImages } from 'types/images';
import ROUTES from 'navigation/routes';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import { isApplicationNotInstalledError } from 'lib/LedgerUtils/errors';
import useShowModal from 'hooks/useShowModal';
import TextModal from 'modals/TextModal';
import { ModalMode } from 'modals/ModalScreen';
import { LedgerConnectionPhase, useConnectToLedger } from './hooks';
import useStyles from './useStyles';

export interface ConnectToLedgerParams {
  readonly bleLedger: BLELedger;
  readonly ledgerApp: LedgerApp;
  readonly onConnect: (transport: BluetoothTransport) => any;
}

type Props = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.CONNECT_TO_LEDGER>;

const ConnectToLedger: React.FC<Props> = ({ navigation, route }) => {
  const { t } = useTranslation('connectToLedger');
  const styles = useStyles();

  const { bleLedger, ledgerApp, onConnect } = route.params;
  const { connecting, connectionPhase, connected, connectionError, transport, retry } =
    useConnectToLedger(bleLedger, ledgerApp);
  const showModal = useShowModal();

  // -------- VARIABLES --------

  const connectionStatus = React.useMemo(() => {
    if (connecting) {
      switch (connectionPhase) {
        case LedgerConnectionPhase.OpeningTransport:
          return t('ledger:opening transport');
        case LedgerConnectionPhase.RequestingAppOpen:
          return t('ledger:please approve application open request');
        case LedgerConnectionPhase.RequestingAppClose:
          return t('ledger:closing wrong application');
        default:
          return t('connecting');
      }
    } else if (connected) {
      return t('common:connected');
    } else if (connectionError !== undefined) {
      switch (connectionError.name) {
        case LedgerErrorType.ConnectionFailed:
          return t('connection failed');
        case LedgerErrorType.DeviceDisconnected:
          return t('device disconnected');
        case LedgerErrorType.DeviceLocked:
          return t('device locked');
        case LedgerErrorType.ApplicationOpenRejected:
          return t('application open request rejected');
        case LedgerErrorType.ApplicationNotInstalled:
          return t('application not installed');
        default:
          return t('common:error');
      }
    } else {
      return t('common:error');
    }
  }, [connected, connecting, connectionError, connectionPhase, t]);

  const errorMessage = React.useMemo(() => {
    if (connectionError === undefined) {
      return undefined;
    }

    switch (connectionError.name) {
      case LedgerErrorType.ConnectionFailed:
        return t('connection failed');
      case LedgerErrorType.DeviceDisconnected:
        return t('device disconnected message');
      case LedgerErrorType.DeviceLocked:
        return t('device locked message');
      case LedgerErrorType.ApplicationOpenRejected:
        return t('please open the application', { application: ledgerApp.name });
      case LedgerErrorType.ApplicationNotInstalled:
        return t('please install the application', { application: ledgerApp.name });
      default:
        return connectionError.message;
    }
  }, [connectionError, ledgerApp.name, t]);

  const statusButton = connected ? t('common:next') : t('common:retry');

  // -------- CALLBACKS --------

  const onButtonPressed = React.useCallback(() => {
    if (connected) {
      onConnect(transport!);
    } else {
      retry();
    }
  }, [connected, onConnect, retry, transport]);

  const showHowToInstallLedgerApp = React.useCallback(() => {
    showModal(
      TextModal,
      {
        title: t('how to install application title', { application: ledgerApp.name }),
        message: t('how to install application message', { application: ledgerApp.name }),
      },
      {
        mode: ModalMode.BottomSheet,
      },
    );
  }, [t, showModal, ledgerApp]);

  // -------- EFFECTS --------

  useEffect(() => {
    if (connected) {
      onConnect(transport!);
    }
  }, [connected, transport, onConnect, navigation]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />}>
      {connecting ? (
        <ThemedLottieView
          style={styles.animation}
          source={DPMAnimations.ConnectToLedger}
          autoPlay
          loop
          resizeMode="cover"
        />
      ) : (
        <DpmImage
          style={styles.image}
          source={connected ? DPMImages.Success : DPMImages.LedgerConnectionError}
        />
      )}

      <Typography.SemiBold20 style={styles.status}>{connectionStatus}</Typography.SemiBold20>
      <Typography.Regular14 style={styles.errorMessage}>{errorMessage}</Typography.Regular14>

      {/* Clickable text that explain to the user how to install the app. */}
      {connectionError !== undefined && isApplicationNotInstalledError(connectionError) && (
        <Typography.SemiBold16 style={styles.installAppMessage} onPress={showHowToInstallLedgerApp}>
          {t('how to install application on ledger', { application: ledgerApp.name })}
        </Typography.SemiBold16>
      )}

      <Flexible.Padding flex={1} />

      <Button mode="contained" onPress={onButtonPressed} disabled={connecting} loading={connecting}>
        {connecting ? t('connecting') : statusButton}
      </Button>
    </StyledSafeAreaView>
  );
};

export default ConnectToLedger;
