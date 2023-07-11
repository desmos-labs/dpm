import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import Typography from 'components/Typography';
import { MsgUpdateStakingModuleParamsEncodeObject } from 'types/cosmos';

/**
 * Displays the full details of a MsgUpdateParams.
 * @constructor
 */
const MsgUpdateParams: MessageDetailsComponent<MsgUpdateStakingModuleParamsEncodeObject> = ({
  message,
}) => {
  const { t } = useTranslation('messages.staking');

  const fields = React.useMemo<MessageDetailsField[]>(
    () => [
      {
        label: t('bond denom'),
        value: message.value.params.bondDenom,
      },
      {
        label: t('max entries'),
        value: message.value.params.maxEntries.toString(),
      },
      {
        label: t('max validators'),
        value: message.value.params.maxValidators.toString(),
      },
      {
        label: t('unbonding time'),
        value: message.value.params.unbondingTime,
      },
      {
        label: t('historical entries'),
        value: message.value.params.historicalEntries.toString(),
      },
      {
        label: t('min commission rate'),
        value: message.value.params.minCommissionRate,
      },
    ],
    [
      message.value.params.bondDenom,
      message.value.params.historicalEntries,
      message.value.params.maxEntries,
      message.value.params.maxValidators,
      message.value.params.minCommissionRate,
      message.value.params.unbondingTime,
      t,
    ],
  );

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        <Trans ns="messages.staking" i18nKey={'update params description'} />
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgUpdateParams;
