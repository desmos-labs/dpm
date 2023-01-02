import React from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {EncodeObject} from '@cosmjs/proto-signing';
import Divider from 'components/Divider';
import LabeledValue from 'components/LabeledValue';
import Typography from 'components/Typography';
import BaseMessage from '../BaseMessage';

export type DetailsProps = {
  typeUrl: string;
  value: string;
};

export type ListItemProps = {
  message: EncodeObject;
  date: Date;
};

namespace MsgUnknown {
  /**
   * Displays the full details of an MsgUnknown message.
   * @constructor
   */
  export const Details: React.FC<DetailsProps> = (props) => {
    const { typeUrl, value } = props;
    const { t } = useTranslation();

    return (
      <View>
        <LabeledValue label={t('message type')} value={typeUrl} />
        <Divider />
        <LabeledValue label={t('message value')} value={value} />
      </View>
    );
  };

  export const ListItem: React.FC<ListItemProps> = ({ message, date }) => (
    <BaseMessage.ListItem
      icon={require('assets/images/messages/unknown.png')}
      date={date}
      renderContent={() => (
        <View>
          <Typography.Caption>{message.typeUrl}</Typography.Caption>
        </View>
      )}
    />
  );
}

export default MsgUnknown;
