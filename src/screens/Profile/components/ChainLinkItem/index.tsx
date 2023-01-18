import React, { useCallback } from 'react';
import { getLinkableChainInfoByName } from 'lib/ChainsUtils';
import { cosmosIcon } from 'assets/images';
import { Image, TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import { useNavigation } from '@react-navigation/native';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import { ChainLink } from 'types/desmos';
import useStyles from './useStyles';

export interface ChainLinkItemProps {
  chainLink: ChainLink;
  canEdit: boolean;
}

const ChainLinkItem = (props: ChainLinkItemProps) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const styles = useStyles();
  const { chainLink, canEdit } = props;

  const onShowChainLinkInfo = useCallback(() => {
    navigation.navigate(ROUTES.CHAIN_LINK_DETAILS, {
      chainLink,
      canEdit,
    });
  }, [canEdit, chainLink, navigation]);

  const chainInfo = getLinkableChainInfoByName(chainLink.chainName);
  const chainIcon = chainInfo?.icon ?? cosmosIcon;
  const chainName = chainInfo?.name ?? chainLink.chainName;
  return (
    <TouchableOpacity style={styles.chainLinkItem} onPress={onShowChainLinkInfo}>
      <Image style={styles.chainLinkIcon} source={chainIcon} />
      <View style={styles.chainLinkInfo}>
        <Typography.Body1 style={styles.chainLinkName}>{chainName}</Typography.Body1>
        <Typography.Caption2 ellipsizeMode="middle" numberOfLines={1}>
          {chainLink.externalAddress}
        </Typography.Caption2>
      </View>
    </TouchableOpacity>
  );
};

export default ChainLinkItem;
