import React from 'react';
import { Image, View, ImageProps } from 'react-native';
import { Divider } from '../Divider';
import { LabeledValue } from '../LabeledValue';
import { makeStyle } from '../../theming';
import { Typography } from '../index';

export type Props = {
  icon?: ImageProps['source'];
  customIconView?: React.ReactElement;
  iconSubtitle?: string;
  fields?: { label: string; value?: string }[];
};

export const SimpleMessageComponent: React.FC<Props> = (props) => {
  const styles = useStyles();

  return (
    <View>
      <View style={styles.txHeader}>
        {props.icon !== undefined ? (
          <Image style={styles.txIcon} source={props.icon} resizeMode="contain" />
        ) : props.customIconView !== undefined ? (
          props.customIconView
        ) : null}
        <Typography.Subtitle style={styles.headerAmount}>{props.iconSubtitle}</Typography.Subtitle>
      </View>
      {props.fields?.map((field, index) => (
        <View key={`field-${index}`}>
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
