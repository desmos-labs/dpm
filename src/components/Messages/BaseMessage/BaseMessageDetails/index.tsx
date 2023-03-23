import React, { useMemo } from 'react';
import { ImageSourcePropType, View } from 'react-native';
import Divider from 'components/Divider';
import Typography from 'components/Typography';
import LabeledValue from 'components/LabeledValue';
import FastImage from 'react-native-fast-image';
import { getImageSource } from 'lib/ImageUtils';
import { desmosLogoOrange } from 'assets/images';
import useStyles from './useStyles';

export interface MessageDetailsField {
  readonly label: string;
  readonly value?: string;
  readonly hide?: boolean;
}

export type BaseMessageDetailsProps = {
  icon?: ImageSourcePropType;
  customIconView?: React.ReactElement;
  iconSubtitle?: string;
  fields?: MessageDetailsField[];
};

const BaseMessageDetails = (props: BaseMessageDetailsProps) => {
  const { icon, customIconView, iconSubtitle, fields } = props;
  const styles = useStyles();
  const customIcon = customIconView !== undefined ? customIconView : null;
  const iconSource = useMemo(() => (icon ? getImageSource(icon) : desmosLogoOrange), [icon]);

  return (
    <View>
      <View style={styles.txHeader}>
        {customIcon ?? <FastImage style={styles.txIcon} source={iconSource} resizeMode="contain" />}
        <Typography.Subtitle style={styles.headerAmount}>{iconSubtitle}</Typography.Subtitle>
      </View>
      {fields
        ?.filter((f) => f.hide !== true)
        ?.map((field, index) => (
          <View key={`field-${index * 2}`}>
            {index > 0 && <Divider />}
            <LabeledValue label={field.label} value={field.value} />
          </View>
        ))}
    </View>
  );
};

export default BaseMessageDetails;
