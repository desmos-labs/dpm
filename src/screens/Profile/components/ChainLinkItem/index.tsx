import React, { useCallback } from 'react';
import { ChainLink } from 'types/chains';
import { getLinkableChainInfoByName } from 'lib/ChainsUtils';
import { cosmosIcon } from 'assets/images';
import { Image, TouchableOpacity, View } from 'react-native';
import Typography from 'components/Typography';
import useStyles from './useStyles';

export interface ChainLinkItemProps {
  chainLink: ChainLink;
}

const ChainLinkItem = (props: ChainLinkItemProps) => {
  const styles = useStyles();
  const { chainLink } = props;

  const onShowChainLinkInfo = useCallback(() => {
    // navigation.navigate({
    //   name: 'ChainLinkDetails',
    //   params: {
    //     chainLink,
    //   },
    // });
  }, [chainLink]);

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
