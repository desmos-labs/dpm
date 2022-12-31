import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { RootStackParams } from 'types/navigation';
import useStyles from './useStyles';

export type Props = StackScreenProps<RootStackParams, 'ModalScreen'>;

const ModalScreen: React.FC<Props> = ({ navigation, route }) => {
  const styles = useStyles();
  const { component, params, navigationRef } = route.params;
  const ModalContent = component;

  useEffect(() => {
    navigationRef.current = navigation;
  }, [navigationRef, navigation]);

  return (
    <View style={styles.root}>
      <View style={styles.content}>
        <ModalContent navigation={navigation} params={params} />
      </View>
    </View>
  );
};

export default ModalScreen;
