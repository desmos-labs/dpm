import React, { useCallback } from 'react';
import { ApplicationLink } from 'types/desmos';
import FastImage from 'react-native-fast-image';
import { getApplicationData } from 'lib/ApplicationLinksUtils';
import { Linking, TouchableOpacity, View } from 'react-native';
import useStyles from './useStyles';

export interface ApplicationLinkItemProps {
  readonly link: ApplicationLink;
}

const ApplicationLinkItem = (props: ApplicationLinkItemProps) => {
  const { link } = props;
  const styles = useStyles();
  const data = getApplicationData(link);

  const onClick = useCallback(async () => {
    Linking.openURL(data?.url);
  }, [data?.url]);

  if (!data) {
    return <View />;
  }

  return (
    <TouchableOpacity onPress={onClick}>
      <FastImage style={styles.image} source={data.image} />
    </TouchableOpacity>
  );
};

export default ApplicationLinkItem;
