import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = {
  onPairRequest?: (uri: string) => void;
};

export default function WalletConnectQRPair(props: Props): JSX.Element {
  const { onPairRequest } = props;

  const onQrCoreRead = (event: BarCodeReadEvent) => {
    if (onPairRequest !== undefined) {
      onPairRequest(event.data);
    }
  };

  return <QRCodeScanner onRead={onQrCoreRead} showMarker />;
}
