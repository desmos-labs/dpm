import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { ChainLink } from 'types/link';
import Typography from 'components/Typography';
import useGetLinkableChainInfoByName from 'hooks/chainlinks/useGetLinkableChainInfoByName';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import ListItemSeparator from 'components/ListItemSeparator';
import useStyles from './useStyles';

export type ChainConnectionsProps = {
  connections: ChainLink[];
  onConnectChain?: () => void;
  onShowChainInfo?: (chain: ChainLink) => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

const ChainConnections: React.FC<ChainConnectionsProps> = ({
  connections,
  style,
  onConnectChain,
  onShowChainInfo,
  loading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const noConnections = connections.length === 0 || loading === true;
  const getLinkableChainInfoByName = useGetLinkableChainInfoByName();

  const renderItem = useCallback(
    (info: ListRenderItemInfo<ChainLink>) => {
      const { item } = info;

      const chainInfo = getLinkableChainInfoByName(item.chainName);
      const chainIcon = chainInfo?.icon ?? require('assets/images/chains/cosmos.png');
      const chainName = chainInfo?.name ?? item.chainName;

      return (
        <TouchableOpacity
          style={styles.connectionItem}
          onPress={() => onShowChainInfo !== undefined && onShowChainInfo(item)}
        >
          <Image style={styles.chainIcon} source={chainIcon} />
          <View style={styles.connectionInfo}>
            <Typography.Body1 style={styles.chainName}>{chainName}</Typography.Body1>
            <Typography.Caption2 ellipsizeMode="middle" numberOfLines={1}>
              {item.externalAddress}
            </Typography.Caption2>
          </View>
        </TouchableOpacity>
      );
    },
    [
      onShowChainInfo,
      styles.chainIcon,
      styles.chainName,
      styles.connectionInfo,
      styles.connectionItem,
    ],
  );

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.noConnections}>
        <DpmImage style={styles.noConnectionImage} resizeMode="cover" source="no-connection" />
        <Typography.Body>{t('connect your chain account')}</Typography.Body>

        <Button style={[styles.marginTop]} onPress={onConnectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      </View>
    ),
    [],
  );

  return (
    <View style={[styles.root, !noConnections ? styles.flexStart : null, style]}>
      {loading === true ? (
        <ActivityIndicator />
      ) : (
        <FlatList
          data={connections}
          renderItem={renderItem}
          keyExtractor={(item) => item.externalAddress}
          ItemSeparatorComponent={ListItemSeparator}
          ListEmptyComponent={ListEmptyComponent}
        />
      )}
      {!noConnections && (
        <Button
          style={[styles.marginTop, styles.marginBottom]}
          onPress={onConnectChain}
          mode="outlined"
        >
          {t('connect chain')}
        </Button>
      )}
    </View>
  );
};

export default ChainConnections;
