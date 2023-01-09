import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import { BLELedger } from 'types/ledger';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ThemedLottieView from 'components/ThemedLottieView';
import ListItemSeparator from 'components/ListItemSeparator';
import Button from 'components/Button';
import ROUTES from 'navigation/routes';
import { DPMAnimations, DPMImages } from 'types/images';
import { ConnectToLedgerStackParamList } from 'navigation/RootNavigator/ConnectToLedgerStack';
import useOnBackAction from 'hooks/useOnBackAction';
import { ScanErrorType, useBleScan } from './useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.PERFORM_LEDGER_SCAN>;

const PerformLedgerScan: React.FC<NavProps> = ({ navigation, route }) => {
  const { ledgerApp, onConnect, onCancel } = route.params;
  const styles = useStyles();
  const { t } = useTranslation('ledgerScan');
  const { requestPermissions, requestEnableBt, scan, scanning, devices, scanError } = useBleScan();

  useOnBackAction(() => {
    if (onCancel !== undefined) {
      onCancel();
    }
  }, [onCancel]);

  useEffect(() => {
    scan().then(() => {});

    // eslint-disable-next-line
  }, []);

  const onLedgerItemSelected = useCallback(
    ({ item }: ListRenderItemInfo<BLELedger>) => {
      navigation.navigate({
        name: ROUTES.CONNECT_TO_LEDGER,
        params: {
          bleLedger: item,
          ledgerApp,
          onConnect,
        },
      });
    },
    [navigation, ledgerApp, onConnect],
  );

  const errorMessage = useMemo(() => {
    if (scanError?.type === ScanErrorType.Unknown) {
      return scanError.message;
    }

    switch (scanError?.type) {
      case ScanErrorType.BtOff:
        return t('error bluetooth off');
      case ScanErrorType.Unauthorized:
        return t('error missing permissions');
      default:
        return undefined;
    }
  }, [t, scanError]);

  const renderLedgerDevice = useCallback(
    (info: ListRenderItemInfo<BLELedger>) => (
      <TouchableOpacity style={styles.ledgerListItem} onPress={() => onLedgerItemSelected(info)}>
        <DpmImage source={DPMImages.Ledger} />
        <Typography.Subtitle style={styles.ledgerName}>{info.item.name}</Typography.Subtitle>
      </TouchableOpacity>
    ),
    [onLedgerItemSelected, styles.ledgerListItem, styles.ledgerName],
  );

  const actionButton = useMemo(() => {
    if (scanError === undefined) {
      return (
        <Button mode={'contained'} loading={scanning} disabled={scanning} onPress={() => scan()}>
          {scanning ? t('looking for devices') : t('start scan')}
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
      case ScanErrorType.Unauthorized:
        return (
          <Button
            mode={'contained'}
            onPress={async () => {
              await requestPermissions();
            }}
          >
            {t('grant permissions')}
          </Button>
        );
      default:
        return null;
    }
  }, [requestEnableBt, requestPermissions, scan, scanError, scanning, t]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />} style={styles.root}>
      <ThemedLottieView
        style={styles.lookingForDevices}
        source={DPMAnimations.LookingForDevices}
        loop
        autoSize
        autoPlay
        speed={scanning ? 1 : 0}
        progress={scanning ? undefined : 0}
      />
      <Typography.Subtitle style={styles.title}>{t('looking for devices')}</Typography.Subtitle>

      <Typography.Body style={styles.advice}>
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
      </Typography.Body>

      {errorMessage === undefined ? (
        <FlatList
          style={styles.deviceList}
          data={devices}
          renderItem={renderLedgerDevice}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListItemSeparator}
        />
      ) : (
        <Typography.Subtitle style={styles.noDeviceError}>{errorMessage}</Typography.Subtitle>
      )}

      {actionButton}
    </StyledSafeAreaView>
  );
};

export default PerformLedgerScan;
