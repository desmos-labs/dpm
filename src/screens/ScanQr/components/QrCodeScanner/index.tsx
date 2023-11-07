import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Barcode, BarcodeFormat, scanBarcodes } from 'vision-camera-code-scanner';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevices, useFrameProcessor } from 'react-native-vision-camera';
import { runOnJS } from 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import usePermissions from 'hooks/permissions/usePermissions';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import useStyles from './useStyles';

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
  const styles = useStyles();
  const [hasPermission, setHasPermission] = useState(false);
  const isFocused = useIsFocused();
  const devices = useCameraDevices();
  const backCameraDevice = devices.back;
  const { checkPermission: checkCameraPermission, requestPermission: requestCameraPermission } =
    usePermissions(AppPermissions.Camera);

  const requestPermission = useCallback(async () => {
    const cameraPermissions = await requestCameraPermission();
    setHasPermission(cameraPermissions === AppPermissionStatus.Granted);
  }, [requestCameraPermission]);

  useEffect(() => {
    (async () => {
      let cameraPermissions = await checkCameraPermission();
      if (cameraPermissions === AppPermissionStatus.Denied) {
        cameraPermissions = await requestCameraPermission();
      }

      setHasPermission(cameraPermissions === AppPermissionStatus.Granted);
    })();

    // Fine to ignore the dependencies here since we need to check the
    // permissions only the first time that we open this screen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  return useMemo(() => {
    if (!hasPermission) {
      return (
        <View style={styles.noPermissionsContainer}>
          <DpmImage source={DPMImages.Fail} />
          <Typography.Body>Pleas grant camera permissions</Typography.Body>
          <Spacer paddingVertical={5} />
          <Button mode={'contained'} onPress={requestPermission}>
            Grant permission
          </Button>
        </View>
      );
    }
    if (backCameraDevice === undefined) {
      return (
        <View style={styles.indicatorView}>
          <StyledActivityIndicator />
        </View>
      );
    }
    return (
      <Camera
        style={StyleSheet.absoluteFill}
        device={backCameraDevice}
        isActive={isFocused}
        frameProcessor={stopRecognition !== true ? frameProcessor : undefined}
        frameProcessorFps={5}
      />
    );
  }, [
    hasPermission,
    backCameraDevice,
    isFocused,
    stopRecognition,
    frameProcessor,
    styles.noPermissionsContainer,
    requestPermission,
  ]);
};

export default QrCodeScanner;
