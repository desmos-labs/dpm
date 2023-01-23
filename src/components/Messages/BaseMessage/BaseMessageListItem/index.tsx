import React, { useMemo } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import Typography from 'components/Typography';
import { format } from 'date-fns';
import FastImage from 'react-native-fast-image';
import { getImageSource } from 'lib/ImageUtils';
import useStyles from './useStyles';

export type BaseMessageListItemProps = {
  date: Date;
  icon: ImageSourcePropType;
  renderContent: () => React.ReactNode;
};

const BaseMessageListItem = (props: BaseMessageListItemProps) => {
  const styles = useStyles();
  const { icon, date, renderContent } = props;
  const iconSource = useMemo(() => getImageSource(icon), [icon]);

  return (
    <View style={styles.root}>
      <View>
        <FastImage style={styles.image} source={iconSource} resizeMode="contain" />
      </View>
      <View style={styles.content}>
        {renderContent()}
        <Typography.Caption style={styles.date}>{format(date, 'dd MMM, HH:mm')}</Typography.Caption>
      </View>
    </View>
  );
};

export default BaseMessageListItem;
