import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
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
import { useStartBleScan } from './useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<ConnectToLedgerStackParamList, ROUTES.PERFORM_LEDGER_SCAN>;

const PerformLedgerScan: React.FC<NavProps> = ({ navigation, route }) => {
  const { ledgerApp, onConnect, onCancel } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const { scanning, scan, devices, scanError } = useStartBleScan();

  useEffect(() => {
    scan().then(() => {});
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK' && onCancel !== undefined) {
          onCancel();
        }
      }),
    [navigation, onCancel],
  );

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
    [navigation, ledgerApp, onCancel],
  );

  const renderLedgerDevice = useCallback(
    (info: ListRenderItemInfo<BLELedger>) => (
      <TouchableOpacity style={styles.ledgerListItem} onPress={() => onLedgerItemSelected(info)}>
        <DpmImage source={DPMImages.Ledger} />
        <Typography.Subtitle style={styles.ledgerName}>{info.item.name}</Typography.Subtitle>
      </TouchableOpacity>
    ),
    [onLedgerItemSelected, styles.ledgerListItem, styles.ledgerName],
  );

  const onRetryPressed = useCallback(() => {
    scan().then(() => {});
  }, [scan]);

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

      <Typography.Body style={styles.advice}>{t('nano x unlock bluetooth check')}</Typography.Body>

      {scanning || devices.length > 0 ? (
        <FlatList
          style={styles.deviceList}
          data={devices}
          renderItem={renderLedgerDevice}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={ListItemSeparator}
        />
      ) : (
        <Typography.Subtitle style={styles.noDeviceError}>
          {scanError?.message ?? t('no device found')}
        </Typography.Subtitle>
      )}

      <Button
        style={styles.retryScan}
        mode="contained"
        onPress={onRetryPressed}
        disabled={scanning}
      >
        {t('retry')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default PerformLedgerScan;
