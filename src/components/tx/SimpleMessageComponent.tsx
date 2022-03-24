import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import { makeStyle } from '../../theming';
import { Divider } from '../Divider';
import { Typography } from '../index';
import { LabeledValue } from '../LabeledValue';

export type Props = {
  icon?: ImageProps['source'];
  customIconView?: React.ReactElement;
  iconSubtitle?: string;
  fields?: { label: string; value?: string }[];
};

export const SimpleMessageComponent: React.FC<Props> = (props) => {
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

const useStyles = makeStyle((_) => ({
  txHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
  },
  txIcon: {
    width: 34,
    height: 34,
  },
  headerAmount: {
    marginTop: 10,
  },
}));
