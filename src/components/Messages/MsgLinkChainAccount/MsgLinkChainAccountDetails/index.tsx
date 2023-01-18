import React, { useCallback, useMemo } from 'react';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportedChains from 'config/LinkableChains';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { cosmosIcon, desmosIcon, disconnectIcon } from 'assets/images';
import useStyles from './useStyles';

export type MsgLinkChainAccountDetailsProps = {
  message: MsgLinkChainAccountEncodeObject;
};

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgLinkChainAccountDetails = (props: MsgLinkChainAccountDetailsProps) => {
  const styles = useStyles();
  const { t } = useTranslation('messages.profiles');

  const { message } = props;
  const { value } = message;
  const getLinkableChainInfoByName = useCallback(
    (chainName: string) => SupportedChains.find((chain) => chainName === chain.chainConfig.name),
    [],
  );

  const bech32Address = useMemo(() => {
    const { chainAddress } = value;
    if (chainAddress !== undefined) {
      return Bech32Address.decode(chainAddress.value);
    }
    return undefined;
  }, [value]);

  const chainName = value.chainConfig?.name;
  const chainIcon = useMemo(() => {
    const chain = chainName !== undefined ? getLinkableChainInfoByName(chainName) : undefined;
    if (chain !== undefined) {
      return chain.icon;
    }
    return cosmosIcon;
  }, [chainName, getLinkableChainInfoByName]);

  return (
    <BaseMessageDetails
      customIconView={
        <View style={styles.customIconView}>
          <Image style={styles.chainLinkIcon} source={desmosIcon} />
          <Image style={styles.disconnectIcon} source={disconnectIcon} />
          <Image style={styles.chainLinkIcon} source={chainIcon} />
        </View>
      }
      fields={[
        {
          label: t('transaction:from'),
          value: value.signer,
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
