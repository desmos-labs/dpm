import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import React, { FC, useCallback } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import Spacer from 'components/Spacer';
import { usePostHog } from 'posthog-react-native';
import useShowModal from 'hooks/useShowModal';
import SingleButtonModal from 'modals/SingleButtonModal';
import { DPMImages } from 'types/images';
import * as Sentry from '@sentry/react-native';
import useStyles from './useStyles';

enum DevRoutes {
  SINGLE_BUTTON_MODAL = 'SINGLE_BUTTON_MODAL',
}

const routesToRender = [
  ROUTES.SPLASH_SCREEN,
  ROUTES.CREATE_NEW_MNEMONIC,
  ROUTES.PROFILE,
  ROUTES.HOME_TABS,
  ROUTES.SETTINGS,
  ROUTES.UNLOCK_APPLICATION,
  ROUTES.SELECT_VALIDATOR,
  ROUTES.VALIDATOR_DETAILS,
  ROUTES.MANAGE_STAKING,
  DevRoutes.SINGLE_BUTTON_MODAL,
];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();
  const postHog = usePostHog()!;
  const showModal = useShowModal();

  const itemSeparator = React.useCallback(() => <Spacer paddingVertical={4} />, []);

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      onPress={() => {
        switch (item) {
          case ROUTES.SELECT_VALIDATOR:
            navigate(ROUTES.SELECT_VALIDATOR, {
              // Allow console log since this a dev screen.
              // eslint-disable-next-line no-console
              onValidatorSelected: console.log,
            });
            break;
          case ROUTES.VALIDATOR_DETAILS:
            navigate(ROUTES.SELECT_VALIDATOR, {
              onValidatorSelected: (validator) => {
                navigate(ROUTES.VALIDATOR_DETAILS, {
                  validator,
                });
              },
            });
            break;

          case DevRoutes.SINGLE_BUTTON_MODAL:
            showModal(SingleButtonModal, {
              image: DPMImages.TxSuccess,
              title: 'Test title',
              message: 'SingleButtonModal test message',
              actionLabel: 'Close',
            });
            break;

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

  const testSentry = React.useCallback(() => {
    Sentry.captureException(new Error('Test error'));
  }, []);

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
      <Button mode="contained" onPress={testSentry}>
        Test Sentry
      </Button>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
