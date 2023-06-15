import React from 'react';
import { Image, View } from 'react-native';
import Typography from 'components/Typography';
import { EncodeObject } from '@cosmjs/proto-signing';
import useMessageName from 'hooks/messages/useMessageName';
import useMessageIcon from 'hooks/messages/useMessageIcon';
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
  children,
}) => {
  const styles = useStyles();
  const name = useMessageName(message);
  const icon = useMessageIcon(message);

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Image style={styles.headerIcon} source={icon} />
        <Typography.Regular14 style={styles.headerLabel}>{name}</Typography.Regular14>
      </View>
      <View style={styles.messageValue}>{children}</View>
    </View>
  );
};

export default BaseMessageDetails;
