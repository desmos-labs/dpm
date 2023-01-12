import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import useWalletConnectPair from 'hooks/walletconnect/useWalletConnectPair';
import IconButton from 'components/IconButton';
import ROUTES from 'navigation/routes';
import { HomeTabsParamList } from 'navigation/RootNavigator/HomeTabs';
import { Barcode } from 'vision-camera-code-scanner';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TextInput from 'components/TextInput';
import { Vibration } from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import useStyles from './useStyles';
import QrCodeScanner from './components/QrCodeScanner';

type NavProps = CompositeScreenProps<
  StackScreenProps<RootNavigatorParamList>,
  StackScreenProps<HomeTabsParamList, ROUTES.SCAN_QR_CODE>
>;

const ScanQr: React.FC<NavProps> = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [pairing, setPairing] = useState(false);
  const [devUri, setDevUri] = useState('');
  const pair = useWalletConnectPair();
  const openModal = useShowModal();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const openErrorModal = useCallback(
    (message: string) => {
      openModal(SingleButtonModal, {
        title: t('error'),
        message,
        actionLabel: t('ok'),
      });
    },
    [openModal, t],
  );

  const startPairProcedure = useCallback(
    async (uri: string) => {
      try {
        setPairing(true);
        setDevUri('');
        const proposal = await pair(uri);
        navigation.navigate(ROUTES.WALLET_CONNECT_SESSION_PROPOSAL, {
          proposal,
        });
      } catch (e) {
        openErrorModal(e.message);
      } finally {
        setPairing(false);
      }
    },
    [navigation, openErrorModal, pair],
  );

  const onDevUriSubmitted = useCallback(() => {
    startPairProcedure(devUri);
  }, [startPairProcedure, devUri]);

  const onQrCodeDetected = useCallback(
    async (barCode: Barcode) => {
      // Provide a feedback that the qr code has been detected.
      Vibration.vibrate();

      if (barCode.rawValue === undefined) {
        openErrorModal(t('invalid qr code'));
      } else {
        startPairProcedure(barCode.rawValue);
      }
    },
    [openErrorModal, startPairProcedure, t],
  );

  return (
    <StyledSafeAreaView style={styles.root} padding={0}>
      <IconButton style={styles.backButton} icon="close" size={18} onPress={goBack} />
      <QrCodeScanner onQrCodeDetected={onQrCodeDetected} stopRecognition={pairing} />
      {__DEV__ && (
        <TextInput
          style={styles.debugUri}
          onChangeText={setDevUri}
          onSubmitEditing={onDevUriSubmitted}
        />
      )}
    </StyledSafeAreaView>
  );
};

export default ScanQr;
