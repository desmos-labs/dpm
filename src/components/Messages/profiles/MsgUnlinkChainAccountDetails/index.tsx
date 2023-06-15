import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import React, { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SupportedChains from 'config/LinkableChains';
import { cosmosIcon } from 'assets/images';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import useStyles from './useStyles';

/**
 * Displays the full details of a MsgUnlinkChainAccount
 * @constructor
 */
const MsgUnlinkChainAccountDetails: MessageDetailsComponent<MsgUnlinkChainAccountEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.profiles');
  const styles = useStyles();
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
      message={message}
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
