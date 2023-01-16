import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import Typography from 'components/Typography';
import { format } from 'date-fns';
import useStyles from './useStyles';

export type BaseMessageListItemProps = {
  date: Date;
  icon: ImageProps['source'];
  renderContent: () => React.ReactNode;
};

const BaseMessageListItem = (props: BaseMessageListItemProps) => {
  const { icon, date, renderContent } = props;
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <View>
        <Image style={styles.image} source={icon} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        {renderContent()}
        <Typography.Caption style={styles.date}>{format(date, 'dd MMM, HH:mm')}</Typography.Caption>
      </View>
    </View>
  );
};

export default BaseMessageListItem;
