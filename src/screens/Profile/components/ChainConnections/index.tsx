import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, ListRenderItemInfo, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Typography from 'components/Typography';
import DpmImage from 'components/DPMImage';
import Button from 'components/Button';
import ListItemSeparator from 'components/ListItemSeparator';
import { ChainLink } from 'types/chains';
import { DPMImages } from 'types/images';
import { useNavigation } from '@react-navigation/native';
import Spacer from 'components/Spacer';
import ChainLinkItem from 'screens/Profile/components/ChainLinkItem';
import useStyles from './useStyles';

export interface ChainConnectionsProps {
  chainLinks: ChainLink[];
  loading: boolean;
}

const ChainConnections: React.FC<ChainConnectionsProps> = (props: ChainConnectionsProps) => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  const { chainLinks, loading } = props;
  const hasConnections = chainLinks.length !== 0;
  const styles = useStyles();

  const onConnectChain = useCallback(() => {
    // navigation.navigate({
    //   name: 'ChainLinkScreens',
    //   params: {
    //     screen: 'ConnectChain',
    //     params: {},
    //   },
    // });
  }, []);

  const renderItem = useCallback((info: ListRenderItemInfo<ChainLink>) => {
    const { item } = info;
    return <ChainLinkItem chainLink={item} />;
  }, []);

  const ListEmptyComponent = useMemo(
    () => (
      <View style={styles.noConnectionsContainer}>
        <DpmImage
          style={styles.noConnectionImage}
          resizeMode="cover"
          source={DPMImages.NoConnection}
        />

        {/* Option to connect a chain */}
        <Typography.Body>{t('connect your chain account')}</Typography.Body>
        <Button style={styles.connectChainButton} onPress={onConnectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      </View>
    ),
    [],
  );

  return (
    <View style={styles.root}>
      {/* Loading indicator */}
      {loading && <ActivityIndicator />}

      {/* Chain links list */}
      {!loading && (
        <View style={styles.connectionsContainer}>
          <Spacer paddingVertical={14} />
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
      {!loading && hasConnections && (
        <Button style={styles.connectChainButton} onPress={onConnectChain} mode="outlined">
          {t('connect chain')}
        </Button>
      )}
    </View>
  );
};

export default ChainConnections;
