import BluetoothTransport from '@ledgerhq/react-native-hw-transport-ble';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import {
  BlockchainListItem,
  ListItemSeparator,
  StyledSafeAreaView,
  TopBar,
} from '../../components';
import { makeStyle } from '../../theming';
import { LedgerApp } from '../../types/ledger';
import { ChainLinkScreensStackParams, ImportMode, RootStackParams } from '../../types/navigation';
import { Typography } from '../../components/typography';

export type Props = CompositeScreenProps<
  StackScreenProps<ChainLinkScreensStackParams, 'SelectLedgerApp'>,
  StackScreenProps<RootStackParams>
>;

export const SelectLedgerApp: React.FC<Props> = ({ navigation, route }) => {
  const { chain, ledgerApplications, backAction } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();

  const renderLedgerApp = useCallback(
    ({ item }: ListRenderItemInfo<LedgerApp>) => (
      <BlockchainListItem
        onPress={() => {
          navigation.navigate({
            name: 'ConnectToLedgerScreens',
            params: {
              ledgerApp: item,
              onConnectionEstablished: (transport: BluetoothTransport) => {
                navigation.navigate({
                  name: 'PickAddress',
                  params: {
                    importMode: ImportMode.Ledger,
                    chain,
                    backAction,
                    ledgerTransport: transport,
                    ledgerApp: item,
                  },
                });
              },
            },
          });
        }}
        name={item.uiName}
        icon={item.icon}
      />
    ),
    [backAction, chain, navigation]
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('select app')} />
      }
    >
      <Typography.Body>{t('select app to connect')}</Typography.Body>

      <FlatList
        style={styles.appList}
        data={ledgerApplications}
        renderItem={renderLedgerApp}
        ItemSeparatorComponent={ListItemSeparator}
        keyExtractor={(item, index) => index.toString()}
      />
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  appList: {
    marginTop: theme.spacing.m,
  },
}));
