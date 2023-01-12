import React, { FC, useCallback, useEffect, useState } from 'react';
import { Barcode, BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export interface QrCodeScannerProps {
  /**
   * Callback to call when this component recognize a QRCode.
   */
  readonly onQrCodeDetected: (qrCode: Barcode) => any;
  /**
   * Tells if the component should stop recognizing qr codes.
   */
  readonly stopRecognition?: boolean;
}

const QrCodeScanner: FC<QrCodeScannerProps> = ({ onQrCodeDetected, stopRecognition }) => {
  const [hasPermission, setHasPermission] = useState(false);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const device = devices.back;

  const requestPermission = useCallback(async () => {
    const status = await Camera.requestCameraPermission();
    setHasPermission(status === 'authorized');
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  const frameProcessor = useFrameProcessor(
    (frame) => {
      'worklet';

      const detectedBarcodes = scanBarcodes(frame, [BarcodeFormat.QR_CODE], {
        // Disable recognitions of qr codes with inverted black and white color.
        checkInverted: false,
      });
      if (detectedBarcodes.length > 0) {
        runOnJS(onQrCodeDetected)(detectedBarcodes[0]);
      }
    },
    [onQrCodeDetected],
  );

  return (
    <>
      {device !== undefined && hasPermission ? (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isFocused}
          frameProcessor={stopRecognition !== true ? frameProcessor : undefined}
          frameProcessorFps={5}
        />
      ) : (
        <ActivityIndicator />
      )}
    </>
  );
};

export default QrCodeScanner;
