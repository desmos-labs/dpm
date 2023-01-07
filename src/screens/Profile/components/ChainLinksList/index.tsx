import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import ListItemSeparator from 'components/ListItemSeparator';
import { ChainLink } from 'types/chains';
import { DPMImages } from 'types/images';
import ChainLinkItem from '../ChainLinkItem';
import useStyles from './useStyles';
import useConnectChain from './useHooks';

export interface ChainConnectionsProps {
  canEdit: boolean;
  chainLinks: ChainLink[];
  loading: boolean;
}

const ChainLinksList: React.FC<ChainConnectionsProps> = (props: ChainConnectionsProps) => {
  const { t } = useTranslation();
  const { canEdit, chainLinks, loading } = props;
  const hasConnections = chainLinks.length !== 0;
  const styles = useStyles();

  const onChainConnected = useCallback(() => {
    console.log('ChainLinksList - Implement onChainConnected');
  }, []);

  const { connectChain } = useConnectChain(onChainConnected);

  const renderItem = (info: ListRenderItemInfo<ChainLink>) => {
    const { item } = info;
    return <ChainLinkItem chainLink={item} />;
  };

  const ListEmptyComponent = useCallback(() => {
    if (!canEdit) {
      return null;
    }

    return (
      <View style={styles.noConnectionsContainer}>
        {/* No connection icon */}
        <DpmImage
          style={styles.noConnectionImage}
          resizeMode="cover"
          source={DPMImages.NoConnection}
        />

        {/* Option to connect a chain */}
        <Typography.Body>{t('connect your chain account')}</Typography.Body>
        <Button style={styles.connectChainButton} onPress={connectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      </View>
    );
  }, [canEdit]);

  return (
    <View style={styles.root}>
      {/* Loading indicator */}
      {loading && <ActivityIndicator />}

      {/* Chain links list */}
      {!loading && (
        <View style={styles.connectionsContainer}>
          {hasConnections && <Typography.Body1>{t('connected chains')}</Typography.Body1>}
          <FlatList
            style={styles.connectionsList}
            data={chainLinks}
            renderItem={renderItem}
            keyExtractor={(item) => item.chainName + item.externalAddress}
            ItemSeparatorComponent={ListItemSeparator}
            ListEmptyComponent={ListEmptyComponent}
          />
        </View>
      )}

      {/* Connect button */}
      {canEdit && !loading && hasConnections && (
        <Button style={styles.connectChainButton} onPress={connectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      )}
    </View>
  );
};

export default ChainLinksList;
