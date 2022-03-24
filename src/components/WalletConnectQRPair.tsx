import React from 'react';
import { BarCodeReadEvent } from 'react-native-camera';
import QRCodeScanner from 'react-native-qrcode-scanner';

type Props = {
  onPairRequest?: (uri: string) => void;
};

export default function WalletConnectQRPair(props: Props): JSX.Element {
  const onQrCoreRead = (event: BarCodeReadEvent) => {
    if (props.onPairRequest !== undefined) {
      props.onPairRequest(event.data);
    }
  };

  return <QRCodeScanner onRead={onQrCoreRead} showMarker />;
}
