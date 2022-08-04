import { AminoMsgUnlinkChainAccount, MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { MsgUnlinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v3/msgs_chain_links';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../utilils/find';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
  protobufMessage?: MsgUnlinkChainAccount;
  encodeObject?: MsgUnlinkChainAccountEncodeObject['value'];
  aminoMessage?: AminoMsgUnlinkChainAccount['value'];
};

export const MessageUnlinkChainAccount: React.FC<Props> = ({
  protobufMessage,
  encodeObject,
  aminoMessage,
}) => {
  const { t } = useTranslation();

  const target = useMemo(
    () => protobufMessage?.target ?? encodeObject?.target ?? aminoMessage?.target ?? '',
    [protobufMessage, encodeObject, aminoMessage]
  );

  const chainIcon = useMemo(() => {
    const chainName =
      protobufMessage?.chainName ?? encodeObject?.chainName ?? aminoMessage?.chain_name;
    const chain = chainName !== undefined ? findLinkableChainInfoByName(chainName) : undefined;
    if (chain !== undefined) {
      return chain.icon;
    }
    return require('../../assets/chains/cosmos.png');
  }, [protobufMessage, encodeObject, aminoMessage]);

  return (
    <SimpleMessageComponent
      customIconView={
        <View style={styles.customIconView}>
          <Image style={styles.chainIcon} source={require('../../assets/chains/desmos.png')} />
          <Image style={styles.disconnectIcon} source={require('../../assets/disconnect.png')} />
          <Image style={styles.chainIcon} source={chainIcon} />
        </View>
      }
      fields={[
        {
          label: t('unlinked account'),
          value: target,
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
