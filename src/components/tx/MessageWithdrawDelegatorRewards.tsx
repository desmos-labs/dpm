import {
  AminoMsgWithdrawDelegatorReward,
  MsgWithdrawDelegatorRewardEncodeObject,
} from '@desmoslabs/sdk-core';
import { MsgWithdrawDelegatorReward } from 'cosmjs-types/cosmos/distribution/v1beta1/tx';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { SimpleMessageComponent } from './SimpleMessageComponent';

export type Props = {
  protobufMessage?: MsgWithdrawDelegatorReward;
  encodeObject?: MsgWithdrawDelegatorRewardEncodeObject['value'];
  aminoMessage?: AminoMsgWithdrawDelegatorReward['value'];
};

export const MessageWithdrawDelegatorRewards: React.FC<Props> = ({
  protobufMessage,
  encodeObject,
  aminoMessage,
}) => {
  const { t } = useTranslation();

  return (
    <SimpleMessageComponent
      icon={require('../../assets/tx-icons/withdraw.png')}
      iconSubtitle={t('withdraw rewards')}
      fields={[
        {
          label: t('from'),
          value:
            protobufMessage?.validatorAddress ??
            encodeObject?.validatorAddress ??
            aminoMessage?.validator_address,
        },
      ]}
    />
  );
};
