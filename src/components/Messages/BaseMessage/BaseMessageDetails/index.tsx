import React from 'react';
import { Image, View } from 'react-native';
import Typography from 'components/Typography';
import { EncodeObject } from '@cosmjs/proto-signing';
import useMessageName from 'hooks/messages/useMessageName';
import useMessageIcon from 'hooks/messages/useMessageIcon';
import Divider from 'components/Divider';
import LabeledValue from 'components/LabeledValue';
import useStyles from './useStyles';

export interface MessageDetailsField {
  readonly label: string;
  readonly value?: string;
  readonly hide?: boolean;
}

export type BaseMessageDetailsProps = {
  message: EncodeObject;
  fields?: MessageDetailsField[];
};

const BaseMessageDetails: React.FC<React.PropsWithChildren<BaseMessageDetailsProps>> = ({
  message,
  fields,
  children,
}) => {
  const styles = useStyles();
  const name = useMessageName(message);
  const icon = useMessageIcon(message);
  const toShowFields = React.useMemo(() => fields?.filter((f) => f.hide !== true) ?? [], [fields]);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Image style={styles.headerIcon} source={icon} />
        <Typography.Regular14 style={styles.headerLabel}>{name}</Typography.Regular14>
      </View>
      <View style={styles.messageValue}>{children}</View>
      <View>
        {toShowFields.map((field, index) => (
          <View key={`field-${index}`}>
            <Divider />
            <LabeledValue style={styles.messageField} label={field.label} value={field.value} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default BaseMessageDetails;
