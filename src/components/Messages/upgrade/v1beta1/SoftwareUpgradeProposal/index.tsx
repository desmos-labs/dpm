import React from 'react';
import { Trans } from 'react-i18next';
import BaseMessageDetails from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import { SoftwareUpgradeProposalEncodeObject } from 'types/cosmos';

/**
 * Displays the full details of a SoftwareUpgradeProposalEncodeObject
 * @constructor
 */
const SoftwareUpgradeProposal: MessageDetailsComponent<SoftwareUpgradeProposalEncodeObject> = ({
  message,
}) => (
  <BaseMessageDetails message={message}>
    <Typography.Regular14>
      <Trans
        ns="messages.upgrade"
        i18nKey={'upgrade chain description'}
        components={[<Typography.SemiBold14 />, <Typography.SemiBold14 />]}
        values={{
          height: message.value.plan?.height?.toString(),
          name: message.value.plan?.name,
        }}
      />
    </Typography.Regular14>
  </BaseMessageDetails>
);

export default SoftwareUpgradeProposal;
