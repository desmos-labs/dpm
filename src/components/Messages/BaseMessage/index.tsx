import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import { format } from 'date-fns';
import { makeStyle } from 'config/theme';
import Divider from 'components/Divider';
import Typography from 'components/Typography';
import LabeledValue from 'components/LabeledValue';
import useStyles from './useStyles';

export type DetailsProps = {
  icon?: ImageProps['source'];
  customIconView?: React.ReactElement;
  iconSubtitle?: string;
  fields?: { label: string; value?: string }[];
};

export type ListItemProps = {
  date: Date;
  icon: ImageProps['source'];
  renderContent: () => React.ReactNode;
};

namespace BaseMessage {
  export const ListItem: React.FC<ListItemProps> = (props) => {
    const useStyles = makeStyle((theme) => ({
      root: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: theme.colors.surface2,
        padding: 8,
      },
      image: {
        marginTop: 6,
        width: 34,
        height: 34,
      },
      content: {
        flex: 1,
        marginLeft: 12,
      },
      date: {
        color: theme.colors.font['3'],
      },
    }));

    const { icon, date, renderContent } = props;
    const styles = useStyles();

    return (
      <View style={styles.root}>
        <View>
          <Image style={styles.image} source={icon} resizeMode="contain" />
        </View>
        <View style={styles.content}>
          {renderContent()}
          <Typography.Caption style={styles.date}>
            {format(date, 'dd MMM, HH:mm')}
          </Typography.Caption>
        </View>
      </View>
    );
  };

  export const Details: React.FC<DetailsProps> = (props) => {
    const { icon, customIconView, iconSubtitle, fields } = props;
    const styles = useStyles();
    const customIcon = customIconView !== undefined ? customIconView : null;
    return (
      <View>
        <View style={styles.txHeader}>
          {icon !== undefined ? (
            <Image style={styles.txIcon} source={icon} resizeMode="contain" />
          ) : (
            customIcon
          )}
          <Typography.Subtitle style={styles.headerAmount}>{iconSubtitle}</Typography.Subtitle>
        </View>
        {fields?.map((field, index) => (
          <View key={`field-${index * 2}`}>
            <Divider />
            <LabeledValue label={field.label} value={field.value} />
          </View>
        ))}
      </View>
    );
  };
}

export default BaseMessage;
