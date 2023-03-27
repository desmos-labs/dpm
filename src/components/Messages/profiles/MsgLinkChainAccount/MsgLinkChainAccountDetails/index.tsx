import React, { useCallback, useMemo } from 'react';
import { MsgLinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportedChains from 'config/LinkableChains';
import { Bech32Address } from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { cosmosIcon, desmosIcon, disconnectIcon } from 'assets/images';
import FastImage from 'react-native-fast-image';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useStyles from './useStyles';

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgLinkChainAccountDetails: MessageDetailsComponent<MsgLinkChainAccountEncodeObject> = ({
  message,
}) => {
  const styles = useStyles();
  const { t } = useTranslation('messages.profiles');
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
          <FastImage style={styles.chainLinkIcon} source={desmosIcon} />
          <FastImage style={styles.disconnectIcon} source={disconnectIcon} />
          <FastImage style={styles.chainLinkIcon} source={chainIcon} />
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
