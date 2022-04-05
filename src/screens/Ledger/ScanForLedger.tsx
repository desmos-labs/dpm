import { StackActions } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, TouchableOpacity } from 'react-native';
import {
  Button,
  DpmImage,
  ListItemSeparator,
  StyledSafeAreaView,
  ThemedLottieView,
  TopBar,
} from '../../components';
import useStartBleScan from '../../hooks/ledger/useStartBleScan';
import { makeStyle } from '../../theming';
import { BleLedger } from '../../types/ledger';
import { ConnectToLedgerScreensStackParams } from '../../types/navigation';
import { Typography } from '../../components/typography';

export type Props = StackScreenProps<ConnectToLedgerScreensStackParams, 'ScanForLedger'>;

export const ScanForLedger: React.FC<Props> = ({ navigation, route }) => {
  const { ledgerApp, onConnectionEstablished, onCancel, autoClose } = route.params;
  const styles = useStyles();
  const { t } = useTranslation();
  const { scanning, scan, devices, scanError } = useStartBleScan();

  useEffect(() => {
    scan().then(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK' && onCancel !== undefined) {
          onCancel();
        }
      }),
    [navigation, onCancel]
  );

  const onDeviceSelected = useCallback(
    (bleLedger: BleLedger) => {
      navigation.dispatch(
        StackActions.replace('ConnectToLedger', {
          bleLedger,
          ledgerApp,
          onConnectionEstablished,
          onCancel,
          autoClose,
        })
      );
    },
    [navigation, ledgerApp, onConnectionEstablished, onCancel, autoClose]
  );

  const renderLedgerDevice = useCallback(
    (info: ListRenderItemInfo<BleLedger>) => (
      <TouchableOpacity style={styles.ledgerListItem} onPress={() => onDeviceSelected(info.item)}>
        <DpmImage source="ledger" />
        <Typography.Subtitle style={styles.ledgerName}>{info.item.name}</Typography.Subtitle>
      </TouchableOpacity>
    ),
    [onDeviceSelected, styles.ledgerListItem, styles.ledgerName]
  );

  const onRetryPressed = useCallback(() => {
    scan().then(() => {});
  }, [scan]);

  return (
    <StyledSafeAreaView topBar={<TopBar stackProps={{ navigation }} />} style={styles.root}>
      <ThemedLottieView
        style={styles.lookingForDevices}
        source="looking-for-devices"
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

      {!scanning && devices.length === 0 && (
        <Button style={styles.retryScan} mode="contained" onPress={onRetryPressed}>
          {t('retry')}
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  lookingForDevices: {
    alignSelf: 'center',
  },
  title: {
    marginTop: theme.spacing.xl,
    alignSelf: 'center',
  },
  advice: {
    textAlign: 'center',
    marginTop: theme.spacing.l,
    paddingHorizontal: theme.spacing.m,
  },
  deviceList: {
    marginTop: theme.spacing.xl,
  },
  noDeviceError: {
    alignSelf: 'center',
    color: theme.colors.primary,
    marginTop: theme.spacing.l,
  },
  ledgerListItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.m,
  },
  ledgerName: {
    marginStart: theme.spacing.m,
  },
  retryScan: {
    marginTop: theme.spacing.m,
  },
}));
