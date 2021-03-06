import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { makeStyle } from '../theming';
import { RootStackParams } from '../types/navigation';

export type Props = StackScreenProps<RootStackParams, 'ModalScreen'>;

export const ModalScreen: React.FC<Props> = ({ navigation, route }) => {
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

const useStyles = makeStyle((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.colors.popupBackground,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: theme.colors.popupSurface,
    elevation: 4,
    borderRadius: theme.roundness,
    padding: theme.spacing.l,
    alignItems: 'center',
  },
  successImage: {
    width: 200,
    height: 100,
  },
}));
