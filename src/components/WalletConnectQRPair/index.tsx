import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

export type WalletConnectQRPairProps = {
  onPairRequest?: (uri: string) => void;
};

const WalletConnectQRPair = (props: WalletConnectQRPairProps) => {
  const { onPairRequest } = props;

  const onQrCoreRead = (event: BarCodeReadEvent) => {
    if (onPairRequest !== undefined) {
      onPairRequest(event.data);
    }
  };

  return <QRCodeScanner onRead={onQrCoreRead} showMarker />;
};

export default WalletConnectQRPair;
