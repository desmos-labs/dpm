import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../../../utilils/find';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message: MsgUnlinkChainAccountEncodeObject['value'];
};

/**
 * Displays the full details of a MsgUnlinkChainAccount
 * @constructor
 */
export const MessageUnlinkChainAccountDetails: React.FC<Props> = ({message}) => {
  const { t } = useTranslation();

  const { chainName}  = message;
  const chainIcon = useMemo(() => {
    const chain = chainName !== undefined ? findLinkableChainInfoByName(chainName) : undefined;
    if (chain !== undefined) {
      return chain.icon;
    }
    return require('../../../../assets/chains/cosmos.png');
  }, [chainName]);

  return (
    <BaseMessageDetails
      customIconView={
        <View style={styles.customIconView}>
          <Image style={styles.chainIcon} source={require('../../../../assets/chains/desmos.png')} />
          <Image style={styles.disconnectIcon} source={require('../../../../assets/disconnect.png')} />
          <Image style={styles.chainIcon} source={chainIcon} />
        </View>
      }
      fields={[
        {
          label: t('unlinked account'),
          value: message.target,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  customIconView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainIcon: {
    width: 44,
    height: 44,
  },
  disconnectIcon: {
    width: 24,
    height: 24,
    marginHorizontal: 20,
  },
});
