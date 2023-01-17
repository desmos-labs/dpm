import React from 'react';
import { Image, ImageProps, View } from 'react-native';
import Divider from 'components/Divider';
import Typography from 'components/Typography';
import LabeledValue from 'components/LabeledValue';
import useStyles from './useStyles';

export type BaseMessageDetailsProps = {
  icon?: ImageProps['source'];
  customIconView?: React.ReactElement;
  iconSubtitle?: string;
  fields?: { label: string; value?: string }[];
};

const BaseMessageDetails = (props: BaseMessageDetailsProps) => {
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
          {index > 0 && <Divider />}
          <LabeledValue label={field.label} value={field.value} />
        </View>
      ))}
    </View>
  );
};

export default BaseMessageDetails;
