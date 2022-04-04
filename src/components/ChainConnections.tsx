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
import { makeStyle } from '../theming';
import { ChainLink } from '../types/link';
import findLinkableChainInfoByName from '../utilils/find';
import { Button } from './Button';
import { DpmImage } from './DpmImage';
import { ListItemSeparator } from './List';
import { Typography } from './typography';

export type Props = {
  connections: ChainLink[];
  onConnectChain?: () => void;
  onShowChainInfo?: (chain: ChainLink) => void;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export const ChainConnections: React.FC<Props> = ({
  connections,
  style,
  onConnectChain,
  onShowChainInfo,
  loading,
}) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const noConnections = connections.length === 0 || loading === true;

  const renderItem = useCallback(
    (info: ListRenderItemInfo<ChainLink>) => {
      const { item } = info;

      const chainInfo = findLinkableChainInfoByName(item.chainName);
      const chainIcon = chainInfo?.icon ?? require('../assets/chains/cosmos.png');
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
    ]
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
    []
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

const useStyles = makeStyle((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  flexStart: {
    alignSelf: 'flex-start',
  },
  noConnections: {
    alignItems: 'center',
  },
  noConnectionImage: {
    width: 90,
    height: 90,
  },
  connectionItem: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainIcon: {
    width: 32,
    height: 32,
  },
  connectionInfo: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: theme.spacing.s,
  },
  chainName: {
    textTransform: 'capitalize',
  },
  marginTop: {
    marginTop: theme.spacing.m,
  },
  marginBottom: {
    marginBottom: theme.spacing.m,
  },
}));
