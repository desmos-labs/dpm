import { StackScreenProps } from '@react-navigation/stack';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import useWalletConnectPair from 'hooks/walletconnect/useWalletConnectPair';
import IconButton from 'components/IconButton';
import ROUTES from 'navigation/routes';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import { Vibration } from 'react-native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { resolveUriActionFromUrl } from 'lib/UriActions';
import useHandleUriAction from 'hooks/uriactions/useHandleUriAction';
import { GenericActionsTypes } from 'types/uri';
import { QrCode } from 'types/qrcode';
import _ from 'lodash';
import Clipboard from '@react-native-community/clipboard';
import Button from 'components/Button';
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
   * If defined sets wich action will be pefromed in case we
   * receive a `UriActionType.Generic` instead of presenting
   * the selction modal to the user.
   */
  readonly genericDpmUriActionOverride?: GenericActionsTypes;
  /**
   * Tells if the screen should be removed from the stack history.
   */
  readonly pop?: boolean;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.SCAN_QR_CODE>;

const ScanQr: React.FC<NavProps> = ({ navigation, route }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const { qrCodeType, genericDpmUriActionOverride, pop } = route.params ?? {};

  const [pairing, setPairing] = useState(false);
  const [stopProcessing, setStopProcessing] = useState(false);
  const pair = useWalletConnectPair();
  const openModal = useShowModal();
  const handleUriAction = useHandleUriAction();

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
    (message: string, action?: () => void) => {
      openModal(SingleButtonModal, {
        title: t('error'),
        message,
        actionLabel: t('ok'),
        action,
      });
    },
    [openModal, t],
  );

  const startPairProcedure = React.useCallback(
    async (uri: string) => {
      setPairing(true);
      const pairResult = await pair(uri);
      if (pairResult.isOk()) {
        navigate(ROUTES.WALLET_CONNECT_SESSION_PROPOSAL, {
          proposal: pairResult.value,
        });
      } else {
        openErrorModal(pairResult.error.message);
      }
      setPairing(false);
    },
    [navigate, openErrorModal, pair],
  );

  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const handleDPMUri = React.useCallback(
    async (uri: string) => {
      setPairing(true);
      const resolveResult = await resolveUriActionFromUrl(uri);
      if (resolveResult.isErr()) {
        openErrorModal(resolveResult.error.message);
      } else {
        const action = resolveResult.value;
        if (action === undefined) {
          openErrorModal(t('invalid qr code'));
        } else {
          handleUriAction(action, genericDpmUriActionOverride);
        }
      }
      setPairing(false);
    },
    [handleUriAction, openErrorModal, t, genericDpmUriActionOverride],
  );

  const processQrCodeData = React.useCallback(
    async (data: string) => {
      let toDetectQrCodeType = qrCodeType;
      // We don't have a specif qr code type, let's try to detect it.
      if (toDetectQrCodeType === undefined) {
        if (data.indexOf('wc:') === 0) {
          toDetectQrCodeType = QrCodeType.WalletConnect;
        } else if (data.indexOf('https://desmos.app.link/') === 0) {
          toDetectQrCodeType = QrCodeType.DPMUris;
        }
      }

      switch (toDetectQrCodeType) {
        case QrCodeType.WalletConnect:
          await startPairProcedure(data);
          break;
        case QrCodeType.DPMUris:
          handleDPMUri(data);
          break;
        default:
          setPairing(true);
          openErrorModal(t('invalid qr code'), () => setPairing(false));
          break;
      }
      setStopProcessing(false);
    },
    [handleDPMUri, openErrorModal, qrCodeType, startPairProcedure, t],
  );
  const debouncedProcessQrCodeData = React.useMemo(
    () => _.debounce(processQrCodeData, 300),
    [processQrCodeData],
  );

  const onQrCodeDetected = React.useCallback(
    async (barCode: QrCode) => {
      // Provide a feedback that the qr code has been detected.
      Vibration.vibrate();

      if (barCode.data === undefined) {
        openErrorModal(t('invalid qr code'));
      } else {
        setStopProcessing(true);
        await debouncedProcessQrCodeData(barCode.data);
      }
    },
    [debouncedProcessQrCodeData, openErrorModal, t],
  );

  const pasteWalletConnectUri = React.useCallback(async () => {
    const uri = await Clipboard.getString();
    if (uri.substring(0, 3) === 'wc:') {
      await processQrCodeData(uri);
    } else {
      openErrorModal(t('no uri in clipboard', { ns: 'walletConnect' }));
    }
  }, [openErrorModal, processQrCodeData, t]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      paddingHorizontal={0}
      touchableWithoutFeedbackDisabled={false}
      edges={[]}
    >
      <IconButton style={styles.backButton} icon="close" size={18} onPress={goBack} />
      <QrCodeScanner onQrCodeDetected={onQrCodeDetected} stopRecognition={stopProcessing} />
      <Button style={styles.pasteUri} mode="text" onPress={pasteWalletConnectUri}>
        {t('paste uri', { ns: 'walletConnect' })}
      </Button>
      {pairing && <StyledActivityIndicator style={styles.pairingIndicator} />}
    </StyledSafeAreaView>
  );
};

export default ScanQr;
