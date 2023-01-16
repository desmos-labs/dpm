import { EncodeObject } from '@cosmjs/proto-signing';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import LabeledValue from 'components/LabeledValue';
import Divider from 'components/Divider';

export type MsgUnknownDetailsProps = {
  message: EncodeObject;
};

/**
 * Displays the full details of an MsgUnknown message.
 * @constructor
 */
export const MsgUnknownDetails = (props: MsgUnknownDetailsProps) => {
  const { message } = props;
  const { t } = useTranslation();

  return (
    <View>
      <LabeledValue label={t('message type')} value={message.typeUrl} />
      <Divider />
      <LabeledValue label={t('message value')} value={JSON.stringify(message.value)} />
    </View>
  );
};

export default MsgUnknownDetails;
