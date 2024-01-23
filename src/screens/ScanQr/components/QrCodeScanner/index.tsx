import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
import { StyleSheet, View } from 'react-native';
import DpmImage from 'components/DPMImage';
import { DPMImages } from 'types/images';
import Typography from 'components/Typography';
import Button from 'components/Button';
import Spacer from 'components/Spacer';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import usePermissions from 'hooks/permissions/usePermissions';
import StyledActivityIndicator from 'components/StyledActivityIndicator';
import { QrCode } from 'types/qrcode';
import useStyles from './useStyles';

interface QrCodeScannerProps {
  /**
   * Callback to call when this component recognize a QRCode.
   */
  readonly onQrCodeDetected: (qrCode: QrCode) => any;
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
  const backCameraDevice = React.useMemo(
    () => devices.find((d) => d.position === 'back'),
    [devices],
  );
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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      if (codes.length > 0) {
        onQrCodeDetected?.({
          data: codes[0].value,
        });
      }
    },
  });

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
        isActive={isFocused && !stopRecognition}
        codeScanner={codeScanner}
      />
    );
  }, [
    hasPermission,
    backCameraDevice,
    isFocused,
    stopRecognition,
    codeScanner,
    styles.noPermissionsContainer,
    styles.indicatorView,
    requestPermission,
  ]);
};

export default QrCodeScanner;
