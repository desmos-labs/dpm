import React, { useMemo } from 'react';
import { Profiles } from '@desmoslabs/desmjs';
import { Trans } from 'react-i18next';
import {
  Base58Address,
  Bech32Address,
  HexAddress,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import CopiableAddress from 'components/CopiableAddress';

/**
 * Displays the full details of a MsgLinkChainAccount.
 * @constructor
 */
const MsgLinkChainAccountDetails: MessageDetailsComponent<
  Profiles.v3.MsgLinkChainAccountEncodeObject
> = ({ message, toBroadcastMessage }) => {
  const linkedAddress = useMemo(() => {
    const { chainAddress } = message.value;
    switch (chainAddress?.typeUrl) {
      case Profiles.v3.Bech32AddressTypeUrl:
        return Bech32Address.decode(chainAddress.value).value;
      case Profiles.v3.Base58AddressTypeUrl:
        return Base58Address.decode(chainAddress.value).value;
      case Profiles.v3.HexAddressTypeUrl:
        return HexAddress.decode(chainAddress.value).value;
      default:
        return undefined;
    }
  }, [message.value]);

  return (
    <BaseMessageDetails message={message}>
      <Typography.Regular14>
        <Trans
          ns="messages.profiles"
          i18nKey={
            toBroadcastMessage
              ? 'link chain account description'
              : 'linked chain account description'
          }
          components={[
            <CopiableAddress address={message.value.signer} />,
            <Typography.SemiBold14 />,
            <CopiableAddress address={linkedAddress} />,
          ]}
          values={{
            chain: message.value.chainConfig?.name,
          }}
        />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgLinkChainAccountDetails;
