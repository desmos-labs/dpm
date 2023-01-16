import React, { useCallback, useMemo } from 'react';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportedChains from 'config/LinkableChains';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import useStyles from './useStyles';

export type MsgLinkChainAccountDetailsProps = {
  message: MsgLinkChainAccountEncodeObject['value'];
};

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgLinkChainAccountDetails = (props: MsgLinkChainAccountDetailsProps) => {
  const { t } = useTranslation();
  const styles = useStyles();
  const { message } = props;
  const getLinkableChainInfoByName = useCallback(
    (chainName: string) => SupportedChains.find((chain) => chainName === chain.chainConfig.name),
    [],
  );

  const bech32Address = useMemo(() => {
    const chainAddress = message?.chainAddress;
    if (chainAddress !== undefined) {
      return Bech32Address.decode(chainAddress.value);
    }
    return undefined;
  }, [message]);

  const chainName = message?.chainConfig?.name;
  const chainIcon = useMemo(() => {
    const chain = chainName !== undefined ? getLinkableChainInfoByName(chainName) : undefined;
    if (chain !== undefined) {
      return chain.icon;
    }
    return require('assets/images/chains/cosmos.png');
  }, [chainName, getLinkableChainInfoByName]);

  return (
    <BaseMessageDetails
      customIconView={
        <View style={styles.customIconView}>
          <Image style={styles.chainLinkIcon} source={require('assets/images/chains/desmos.png')} />
          <Image style={styles.disconnectIcon} source={require('assets/images/disconnect.png')} />
          <Image style={styles.chainLinkIcon} source={chainIcon} />
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

export default MsgLinkChainAccountDetails;
