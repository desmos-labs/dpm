import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useCallback, useMemo } from 'react';
import { Image, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import SupportedChains from 'config/LinkableChains';
import { cosmosIcon, desmosIcon, disconnectIcon } from 'assets/images';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import useStyles from './useStyles';

export type MsgUnlinkChainAccountDetailsProps = {
  message: MsgUnlinkChainAccountEncodeObject;
};

/**
 * Displays the full details of a MsgUnlinkChainAccount
 * @constructor
 */
const MsgUnlinkChainAccountDetails = (props: MsgUnlinkChainAccountDetailsProps) => {
  const { t } = useTranslation('messages.profiles');
  const styles = useStyles();

  const { message } = props;
  const { value } = message;
  const getLinkableChainInfoByName = useCallback(
    (chainName: string) => SupportedChains.find((chain) => chainName === chain.chainConfig.name),
    [],
  );

  const { chainName } = value;
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
          label: t('unlinked account'),
          value: value.target,
        },
      ]}
    />
  );
};

export default MsgUnlinkChainAccountDetails;
