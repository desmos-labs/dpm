import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v2/models_chain_links';
import { MsgLinkChainAccount } from '@desmoslabs/desmjs-types/desmos/profiles/v2/msgs_chain_links';
import { AminoMsgLinkChainAccount, MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../utilils/find';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
  protobufMessage?: MsgLinkChainAccount;
  encodeObject?: MsgLinkChainAccountEncodeObject['value'];
  aminoMessage?: AminoMsgLinkChainAccount['value'];
};

export const MessageLinkChainAccount: React.FC<Props> = ({
  protobufMessage,
  encodeObject,
  aminoMessage,
}) => {
  const { t } = useTranslation();

  const from = useMemo(
    () => protobufMessage?.signer ?? encodeObject?.signer ?? aminoMessage?.signer,
    [protobufMessage, encodeObject, aminoMessage]
  );

  const bech32Address = useMemo(() => {
    const chainAddress = protobufMessage?.chainAddress ?? encodeObject?.chainAddress;
    if (aminoMessage !== undefined) {
      return aminoMessage.chain_address.value;
    }
    if (
      chainAddress !== undefined &&
      chainAddress.typeUrl === '/desmos.profiles.v1beta1.Bech32Address'
    ) {
      return Bech32Address.decode(chainAddress.value);
    }
    return undefined;
  }, [protobufMessage, encodeObject, aminoMessage]);

  const chainName = useMemo(() => {
    if (aminoMessage !== undefined) {
      return aminoMessage.chain_config.name;
    }
    return protobufMessage?.chainConfig?.name ?? encodeObject?.chainConfig?.name;
  }, [protobufMessage, encodeObject, aminoMessage]);

  const chainIcon = useMemo(() => {
    const chain = chainName !== undefined ? findLinkableChainInfoByName(chainName) : undefined;
    if (chain !== undefined) {
      return chain.icon;
    }
    return require('../../assets/chains/cosmos.png');
  }, [chainName]);

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
          label: t('from'),
          value: from,
        },
        {
          label: t('connect to'),
          value: bech32Address?.value ?? '',
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
