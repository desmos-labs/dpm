import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import Spacer from 'components/Spacer';
import { usePostHog } from 'posthog-react-native';
import useStyles from './useStyles';

const routesToRender = [
  ROUTES.SPLASH_SCREEN,
  ROUTES.CREATE_NEW_MNEMONIC,
  ROUTES.PROFILE,
  ROUTES.HOME_TABS,
  ROUTES.SETTINGS,
  ROUTES.UNLOCK_APPLICATION,
  ROUTES.STACKING,
];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();
  const postHog = usePostHog()!;

  const itemSeparator = React.useCallback(() => <Spacer paddingVertical={4} />, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        switch (item) {
          default:
            navigate(item);
            break;
        }
      }}
      style={styles.button}
    >
      <Text style={styles.text}>{item}</Text>
    </TouchableOpacity>
  );

  const navigateToLandingPage = useCallback(() => {
    navigation.navigate(ROUTES.LANDING);
  }, [navigation]);

  const testPostHogEvent = useCallback(() => {
    postHog.capture('Test event');
  }, [postHog]);

  return (
    <StyledSafeAreaView>
      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={styles.flatList}
        data={routesToRender}
        renderItem={renderItem}
        ItemSeparatorComponent={itemSeparator}
      />

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={testPostHogEvent}>
        Send PostHog test event
      </Button>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
