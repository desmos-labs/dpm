import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo } from 'react-native';
import { LinkableChain, LinkableChains } from 'types/chain';
import { CosmosLedgerApp, CryptoOrgLedgerApp, LedgerApp, TerraLedgerApp } from 'types/ledger';
import { ChainLinkScreensStackParams, ImportMode } from 'types/navigation';
import BlockchainListItem from 'components/BlockchainListItem';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import ListItemSeparator from 'components/ListItemSeparator';
import useStyles from './useStyles';

export type Props = StackScreenProps<ChainLinkScreensStackParams, 'SelectChain'>;

function getLedgerApplicationForChain(chain: LinkableChain): LedgerApp[] {
  if (chain.chainConfig.name === 'terra') {
    return [TerraLedgerApp, CosmosLedgerApp];
  }
  if (chain.chainConfig.name === 'crypto.org') {
    return [CryptoOrgLedgerApp, CosmosLedgerApp];
  }
  return [CosmosLedgerApp];
}

const SelectChain: React.FC<Props> = ({ navigation, route }) => {
  const { importMode, feeGranter, backAction } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();

  const linkChain = useCallback(
    (chain: LinkableChain) => {
      if (importMode === ImportMode.Mnemonic) {
        navigation.navigate({
          name: 'LinkWithMnemonic',
          params: {
            importMode,
            chain,
            feeGranter,
            backAction,
          },
        });
      } else {
        navigation.navigate({
          name: 'SelectLedgerApp',
          params: {
            chain,
            ledgerApplications: getLedgerApplicationForChain(chain),
            backAction,
          },
        });
      }
    },
    [navigation, importMode, feeGranter, backAction],
  );

  const renderListItem = useCallback(
    ({ item }: ListRenderItemInfo<LinkableChain>) => (
      <BlockchainListItem name={item.name} icon={item.icon} onPress={() => linkChain(item)} />
    ),
    [linkChain],
  );

  return (
    <StyledSafeAreaView
      style={styles.background}
      topBar={
        <TopBar style={styles.background} stackProps={{ navigation }} title={t('select chain')} />
      }
    >
      <FlatList
        style={styles.list}
        data={LinkableChains}
        renderItem={renderListItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={ListItemSeparator}
      />
    </StyledSafeAreaView>
  );
};

export default SelectChain;
