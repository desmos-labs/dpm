import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useMemo, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Platform, View } from 'react-native';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import Button from 'components/Button';
import ROUTES from 'navigation/routes';
import { DPMAnimations, DPMImages } from 'types/images';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import useOnBackAction from 'hooks/useOnBackAction';
import { AppPermissions, AppPermissionStatus } from 'types/permissions';
import LedgerDeviceList from 'screens/PerformLedgerScan/components/LedgerDeviceList';
import usePermissions from 'hooks/permissions/usePermissions';
import DpmImage from 'components/DPMImage';
import useStyles from './useStyles';
import { ScanErrorType, useBleScan, useRequestEnableBt } from './useHooks';

type NavProps = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.PERFORM_LEDGER_SCAN>;

const PerformLedgerScan: React.FC<NavProps> = ({ navigation, route }) => {
  const { ledgerApp, onConnect, onCancel } = route.params;
  const styles = useStyles();
  const { t } = useTranslation('ledger');
  const { scan, scanning, devices, scanError } = useBleScan();
  const [authorized, setAuthorized] = useState(false);
  const [doFirstScan, setDoFirstScan] = useState(true);
  const requestEnableBt = useRequestEnableBt();
  const { checkPermission: checkBtPermissions, requestPermission: requestBluetoothPermissions } =
    usePermissions(AppPermissions.Bluetooth);

  useOnBackAction(() => {
    if (onCancel !== undefined) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    if (doFirstScan && authorized) {
      setDoFirstScan(false);
      scan().then(() => {});
    }
  }, [doFirstScan, authorized, scan]);

  useEffect(() => {
    (async () => {
      let checkResult = await checkBtPermissions();
      if (checkResult === AppPermissionStatus.Denied) {
        checkResult = await requestBluetoothPermissions();
      }

      setAuthorized(checkResult === AppPermissionStatus.Granted);
    })();

    // Fine to ignore since we need to check the permissions only the first time
    // we open this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorMessage = useMemo(() => {
    if (!authorized) {
      return Platform.OS === 'ios' ? t('grant permissions ios') : t('grant permissions android');
    }

    if (scanError?.type === ScanErrorType.Unknown) {
      return scanError.message;
    }

    switch (scanError?.type) {
      case ScanErrorType.BtOff:
        return t('error bluetooth off');
      default:
        return undefined;
    }
  }, [authorized, scanError, t]);

  const actionButton = useMemo(() => {
    if (!authorized) {
      return (
        <Button
          mode={'contained'}
          onPress={async () => {
            const permissions = await requestBluetoothPermissions();
            if (permissions === AppPermissionStatus.Granted) {
              setAuthorized(true);
            }
          }}
        >
          {t('grant permissions')}
        </Button>
      );
    }

    if (scanError === undefined) {
      return (
        <Button mode={'contained'} loading={scanning} disabled={scanning} onPress={() => scan()}>
          {scanning ? t('looking for devices') : t('common:retry')}
        </Button>
      );
    }

    switch (scanError.type) {
      case ScanErrorType.BtOff:
        return (
          <Button
            mode={'contained'}
            onPress={async () => {
              const result = await requestEnableBt();
              if (result) {
                await scan();
              }
            }}
          >
            {t('turn on bluetooth')}
          </Button>
        );
      default:
        return null;
    }
  }, [t, authorized, scanError, requestBluetoothPermissions, scanning, scan, requestEnableBt]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />} style={styles.root}>
      {/* Show the device list while scanning and if we found at least on device */}
      {((authorized && scanning) || devices.length > 0) && (
        <>
          <ThemedLottieView
            style={styles.lookingForDevices}
            source={DPMAnimations.LookingForDevices}
            loop
            autoPlay
            speed={scanning ? 1 : 0}
            progress={scanning ? undefined : 0}
            resizeMode="cover"
          />
          <Typography.SemiBold20 style={styles.title}>
            {t('looking for devices')}
          </Typography.SemiBold20>

          <Typography.Regular14 style={styles.advice}>
            <Trans
              t={t}
              i18nKey="nano x unlock bluetooth check"
              values={{
                app: ledgerApp.name,
              }}
              components={{
                bold: <Typography.Subtitle />,
              }}
            />
          </Typography.Regular14>

          {errorMessage === undefined && authorized ? (
            <LedgerDeviceList ledgerApp={ledgerApp} devices={devices} onConnect={onConnect} />
          ) : (
            <Typography.Subtitle style={styles.noDeviceError}>{errorMessage}</Typography.Subtitle>
          )}
        </>
      )}

      {/* Show no device found UI */}
      {!scanning && devices.length === 0 && (
        <View style={styles.errorView}>
          <DpmImage style={styles.errorImage} source={DPMImages.LedgerConnectionError} />
          <Typography.SemiBold20 style={styles.title}>
            {authorized ? t('sorry, no device found') : t('sorry, missing permissions')}
          </Typography.SemiBold20>
          <Typography.Regular14 style={styles.advice}>
            {authorized ? (
              <Trans
                t={t}
                i18nKey="nano x unlock bluetooth check"
                values={{
                  app: ledgerApp.name,
                }}
                components={{
                  bold: <Typography.Subtitle />,
                }}
              />
            ) : (
              Platform.select({
                ios: t('grant permissions ios'),
                android: t('grant permissions android'),
              })
            )}
          </Typography.Regular14>
        </View>
      )}

      {actionButton}
    </StyledSafeAreaView>
  );
};

export default PerformLedgerScan;
