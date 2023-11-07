import { EncodeObject } from '@desmoslabs/desmjs';
import { MessageDetailsComponent } from 'components/Messages/BaseMessage';
import BaseMessageDetails, {
  MessageDetailsField,
} from 'components/Messages/BaseMessage/BaseMessageDetails';
import Typography from 'components/Typography';
import { formatCoin } from 'lib/FormatUtils';
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
        if (typeof objectValue.denom === 'string' && typeof objectValue.amount === 'string') {
          serializedValue = formatCoin(objectValue);
        } else {
          serializedValue = JSON.stringify(objectValue, undefined, 4);
        }
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
