import React from 'react';
import { View } from 'react-native';
import Typography from 'components/Typography';
import Spacer from 'components/Spacer';
import Button from 'components/Button';
import useStyles from './useStyles';

export interface ListHeaderProps {}

const ListHeader: React.FC<ListHeaderProps> = (props) => {
  const styles = useStyles();

  return (
    <View style={styles.root}>
      <Typography.Subtitle2>address</Typography.Subtitle2>

      <Spacer paddingVertical={32} />

      <Typography.Subtitle2>total balance</Typography.Subtitle2>
      <Typography.H1>amount $</Typography.H1>
      <Typography.Subtitle2>dsm balance</Typography.Subtitle2>

      <Spacer paddingVertical={25} />

      <View style={styles.actionContainer}>
        <View style={styles.actionValues}>
          <Typography.Subtitle2>available</Typography.Subtitle2>
          <Typography.Subtitle>amount</Typography.Subtitle>
        </View>
        <Button accent mode={'contained'}>
          send
        </Button>
      </View>

      <Spacer paddingVertical={8} />

      <View style={styles.actionContainer}>
        <View style={styles.actionValues}>
          <Typography.Subtitle2>available</Typography.Subtitle2>
          <Typography.Subtitle>amount</Typography.Subtitle>
        </View>
        <Button mode={'contained'}>claim</Button>
      </View>

      <Spacer paddingVertical={8} />

      <View style={styles.actionContainer}>
        <View style={styles.actionValues}>
          <Typography.Subtitle2>total staked</Typography.Subtitle2>
          <Typography.Subtitle>amount</Typography.Subtitle>
        </View>
        <Button mode={'contained'}>manage</Button>
      </View>

      <Spacer paddingVertical={25} />
    </View>
  );
};

export default ListHeader;
