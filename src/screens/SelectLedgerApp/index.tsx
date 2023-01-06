import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { LedgerApp } from 'types/ledger';
import { ChainLinkScreensStackParams, RootStackParams } from 'types/navigation';
import Typography from 'components/Typography';
import BlockchainListItem from 'components/BlockchainListItem';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ListItemSeparator from 'components/ListItemSeparator';
import useStyles from './useStyles';

export type Props = CompositeScreenProps<
  StackScreenProps<ChainLinkScreensStackParams, 'SelectLedgerApp'>,
  StackScreenProps<RootStackParams>
>;

const SelectLedgerApp: React.FC<Props> = ({ navigation, route }) => {
  const { chain, ledgerApplications, backAction } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();

  const renderLedgerApp = useCallback(
    ({ item }: ListRenderItemInfo<LedgerApp>) => (
      <BlockchainListItem name={item.uiName} icon={item.icon} />
    ),
    [backAction, chain, navigation],
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

export default SelectLedgerApp;
