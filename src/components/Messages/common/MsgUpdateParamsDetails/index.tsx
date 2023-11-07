import { EncodeObject } from '@desmoslabs/desmjs';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import Typography from 'components/Typography';
import { formatCoin, formatCoins, isCoin } from 'lib/FormatUtils';
import React from 'react';
import { useTranslation } from 'react-i18next';

const MsgUpdateParamsDetails: MessageDetailsComponent<EncodeObject> = ({ message }) => {
  const { t } = useTranslation('messages.common');
  const moduleName = React.useMemo(() => {
    const [, name] = message.typeUrl.split('.');
    return `${name[0].toUpperCase()}${name.substring(1)}`;
  }, [message.typeUrl]);

  const fields = React.useMemo<MessageDetailsField[]>(() => {
    const result: MessageDetailsField[] = [];
    Object.keys(message.value.params).forEach((key) => {
      const objectValue = message.value.params[key];
      let serializedValue: string;

      if (typeof objectValue === 'object') {
        // Special case for the coin object.
        if (isCoin(objectValue)) {
          serializedValue = formatCoin(objectValue);
        } else if (
          Object.prototype.toString.call(objectValue) === '[object Array]' &&
          isCoin(objectValue[0])
        ) {
          // Special case for array of coins.
          serializedValue = formatCoins(objectValue);
        } else {
          serializedValue = JSON.stringify(objectValue, undefined, 4);
        }
      } else if (objectValue === null || objectValue === undefined) {
        serializedValue = 'null';
      } else {
        serializedValue = objectValue.toString();
      }

      result.push({
        label: key,
        value: serializedValue,
      });
    });
    return result;
  }, [message.value]);

  return (
    <BaseMessageDetails message={message} fields={fields}>
      <Typography.Regular14>
        {t('update module params', { module: moduleName })}
      </Typography.Regular14>
    </BaseMessageDetails>
  );
};

export default MsgUpdateParamsDetails;
