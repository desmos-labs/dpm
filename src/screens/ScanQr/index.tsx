import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import useWalletConnectPair from 'hooks/useWalletConnectPair';
import { AccountScreensStackParams, HomeScreensBottomTabsParams } from 'types/navigation';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import IconButton from 'components/IconButton';
import TextInput from 'components/TextInput';
import useStyles from './useStyles';

export type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeScreensBottomTabsParams, 'ScanQr'>,
  StackScreenProps<AccountScreensStackParams>
>;

const ScanQr: React.FC<Props> = ({ navigation }) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [devUri, setDevUri] = useState('');
  const [pairingStatus, pair] = useWalletConnectPair();
  const openModal = useShowModal();

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const onDevUriSubmitted = useCallback(() => {
    pair(devUri).catch(console.error);
  }, [devUri, pair]);

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

  const onQrCoreRead = useCallback(
    async (event: BarCodeReadEvent) => {
      try {
        await pair(event.data);
      } catch (e) {
        openErrorModal(t('invalid qr code'));
      }
    },
    [pair, openErrorModal, t],
  );

  useEffect(() => {
    if (!pairingStatus.pairing) {
      if (pairingStatus.requestDetails) {
        navigation.navigate({
          name: 'AuthorizeSession',
          params: {
            sessionRequestDetails: pairingStatus.requestDetails,
          },
        });
      } else if (pairingStatus.error) {
        openErrorModal(pairingStatus.error);
      }
    }
  }, [navigation, pairingStatus, openErrorModal]);

  return (
    <StyledSafeAreaView style={styles.root} padding={0}>
      <IconButton style={styles.backButton} icon="close" size={18} onPress={goBack} />
      <QRCodeScanner
        cameraStyle={styles.camera}
        onRead={onQrCoreRead}
        showMarker
        reactivate
        reactivateTimeout={5000}
      />
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
