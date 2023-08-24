import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import useWalletConnectPair from 'hooks/walletconnect/useWalletConnectPair';
import IconButton from 'components/IconButton';
import ROUTES from 'navigation/routes';
import { Barcode } from 'vision-camera-code-scanner';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TextInput from 'components/TextInput';
import { Vibration } from 'react-native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';
import QrCodeScanner from './components/QrCodeScanner';

export enum QrCodeType {
  /**
   * Parse WalletConnect QR codes.
   */
  WalletConnect,
  /**
   * Parse QR codes that may contain a DPM style uri.
   */
  DPMUris,
}

export interface ScanQrCodeParams {
  /**
   * Type of qrcode that should be read, if this field is undefined
   * this screen will try to detect the type of qr code that is being
   * processed automatically.
   */
  readonly qrCodeType?: QrCodeType;
  /**
   * Tells if the screen should be removed from the stack history.
   */
  readonly pop?: boolean;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SCAN_QR_CODE>;

const ScanQr: React.FC<NavProps> = ({ navigation, route }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { qrCodeType, pop } = route.params ?? {};

  const [pairing, setPairing] = useState(false);
  const [devUri, setDevUri] = useState('');
  const pair = useWalletConnectPair();
  const openModal = useShowModal();

  const navigate = React.useCallback<(typeof navigation)['navigate']>(
    (...args) => {
      if (pop) {
        navigation.goBack();
      }

      // @ts-ignore
      navigation.navigate(...args);
    },
    [navigation, pop],
  );

  const goBack = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openErrorModal = React.useCallback(
    (message: string) => {
      openModal(SingleButtonModal, {
        title: t('error'),
        message,
        actionLabel: t('ok'),
      });
    },
    [openModal, t],
  );

  const startPairProcedure = React.useCallback(
    async (uri: string) => {
      try {
        setPairing(true);
        setDevUri('');
        const proposal = await pair(uri);
        navigate(ROUTES.WALLET_CONNECT_SESSION_PROPOSAL, {
          proposal,
        });
      } catch (e) {
        openErrorModal(e.message);
      } finally {
        setPairing(false);
      }
    },
    [navigate, openErrorModal, pair],
  );

  const handleDPMUri = React.useCallback((uri: string) => {
    // TODO: Resolve the deep link uri.
  }, []);

  const processQrCodeData = React.useCallback(
    async (data: string) => {
      if (qrCodeType === QrCodeType.WalletConnect) {
        await startPairProcedure(data);
      } else if (qrCodeType === QrCodeType.DPMUris) {
        handleDPMUri(data);
      } else if (data.indexOf('dpm://') === 0) {
        // This is a dpm uri, try to parse it.
        handleDPMUri(data);
      } else {
        openErrorModal(t('invalid qr code'));
      }
    },
    [handleDPMUri, openErrorModal, qrCodeType, startPairProcedure, t],
  );

  const onDevUriSubmitted = React.useCallback(async () => {
    await processQrCodeData(devUri);
  }, [processQrCodeData, devUri]);

  const onQrCodeDetected = React.useCallback(
    async (barCode: Barcode) => {
      // Provide a feedback that the qr code has been detected.
      Vibration.vibrate();

      if (barCode.rawValue === undefined) {
        openErrorModal(t('invalid qr code'));
      } else {
        await processQrCodeData(barCode.rawValue);
      }
    },
    [openErrorModal, processQrCodeData, t],
  );

  return (
    <StyledSafeAreaView style={styles.root} padding={0} touchableWithoutFeedbackDisabled={false}>
      <IconButton style={styles.backButton} icon="close" size={18} onPress={goBack} />
      <QrCodeScanner onQrCodeDetected={onQrCodeDetected} stopRecognition={pairing} />
      {__DEV__ && (
        <TextInput
          style={styles.debugUri}
          onChangeText={setDevUri}
          onSubmitEditing={onDevUriSubmitted}
        />
      )}
      {pairing && <StyledActivityIndicator style={styles.pairingIndicator} />}
    </StyledSafeAreaView>
  );
};

export default ScanQr;
