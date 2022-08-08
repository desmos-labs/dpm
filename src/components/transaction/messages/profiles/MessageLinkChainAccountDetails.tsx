import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, StyleSheet, View } from 'react-native';
import findLinkableChainInfoByName from '../../../../utilils/find';
import { BaseMessageDetails } from '../BaseMessageDetails';

export type Props = {
  message: MsgLinkChainAccountEncodeObject['value'];
};

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
export const MessageLinkChainAccountDetails: React.FC<Props> = ({message}) => {
  const { t } = useTranslation();

  const bech32Address = useMemo(() => {
    const chainAddress = message?.chainAddress;
    if (chainAddress !== undefined) {
      return Bech32Address.decode(chainAddress.value);
    }
    return undefined;
  }, [message]);

  const chainName = message?.chainConfig?.name;
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
          label: t('from'),
          value: message.signer,
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
