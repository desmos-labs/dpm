import { MsgSendEncodeObject } from '@cosmjs/stargate';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import useCurrentChainInfo from '../../../../hooks/desmosclient/useCurrentChainInfo';
import { BaseMessageDetails } from '../BaseMessageDetails';
import {coinsToString} from "../../../utils";

export type Props = {
  message: MsgSendEncodeObject["value"];
};

/**
 * Displays the full details of a MsgSend.
 * @constructor
 */
export const MessageSendDetails: React.FC<Props> = ({ message }) => {
  const { t } = useTranslation();
  const chainInfo = useCurrentChainInfo();
  const convertedAmount = useMemo(() => coinsToString(message.amount, chainInfo), [message.amount, chainInfo]);

  return (
    <BaseMessageDetails
      icon={require('../../../../assets/tx-icons/send.png')}
      iconSubtitle={convertedAmount}
      fields={[
        {
          label: t('from'),
          value: message.fromAddress ?? '',
        },
        {
          label: t('to'),
          value: message.toAddress ?? '',
        },
        {
          label: t('amount'),
          value: convertedAmount,
        },
      ]}
    />
  );
};
