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
import { ModalMode } from 'modals/ModalScreen';
import Typography from 'components/Typography';
import useAppFeatureFlags from 'hooks/featureflags/useAppFeatureFlags';
import useShowTestTransaction from 'hooks/dev/useShowTestTransaction';
import GovernanceVoteModal from 'modals/GovernanceVoteModal';
import AmountAndMemoModal from 'modals/AmountAndMemoModal';
import { AmountLimit } from 'components/CoinAmountInput/limits';
import { resetSecureStorage } from 'lib/SecureStorage';
import useHandleUriAction from 'hooks/uriactions/useHandleUriAction';
import LoadingModal from 'modals/LoadingModal';
import { useUriAction } from '@recoil/uriaction';
import useStyles from './useStyles';

enum DevRoutes {
  SINGLE_BUTTON_MODAL = 'SINGLE_BUTTON_MODAL',
  BOTTOM_MODAL = 'BOTTOM_MODAL',
  TEST_TRANSACTION = 'TEST_TRANSACTION',
  GOVERNANCE_VOTE_MODAL = 'GOVERNANCE_VOTE_MODAL',
  AMOUNT_AND_MEMO_MODAL = 'AMOUNT_AND_MEMO_MODAL',
  LOADING_MODAL = 'LOADING_MODAL',
}

const routesToRender = [
  ROUTES.SPLASH_SCREEN,
  ROUTES.SELECT_NEW_MNEMONIC_LENGTH,
  ROUTES.PROFILE,
  ROUTES.HOME_TABS,
  ROUTES.SETTINGS,
  ROUTES.UNLOCK_APPLICATION,
  ROUTES.SELECT_VALIDATOR,
  ROUTES.VALIDATOR_DETAILS,
  ROUTES.MANAGE_STAKING,
  ROUTES.COMPONENTS_DEMO,
  ROUTES.SPLASH_SCREEN,
  DevRoutes.SINGLE_BUTTON_MODAL,
  DevRoutes.BOTTOM_MODAL,
  DevRoutes.TEST_TRANSACTION,
  DevRoutes.GOVERNANCE_VOTE_MODAL,
  DevRoutes.AMOUNT_AND_MEMO_MODAL,
  DevRoutes.LOADING_MODAL,
];

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.DEV_SCREEN>;

const DevScreen: FC<NavProps> = ({ navigation }) => {
  const { navigate } = navigation;
  const styles = useStyles();
  const postHog = usePostHog()!;
  const showModal = useShowModal();
  const appFeatureFlags = useAppFeatureFlags();
  const handleUriAction = useHandleUriAction();
  const uriAction = useUriAction();

  const itemSeparator = React.useCallback(() => <Spacer paddingVertical={4} />, []);
  const showTestTransaction = useShowTestTransaction();

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

          case DevRoutes.BOTTOM_MODAL:
            showModal(
              SingleButtonModal,
              {
                image: DPMImages.TxSuccess,
                title: 'Test title',
                message: 'SingleButtonModal test message',
                actionLabel: 'Close',
              },
              {
                mode: ModalMode.BottomSheet,
              },
            );
            break;

          case DevRoutes.TEST_TRANSACTION:
            showTestTransaction();
            break;

          case DevRoutes.GOVERNANCE_VOTE_MODAL:
            showModal(
              GovernanceVoteModal,
              {},
              {
                mode: ModalMode.BottomSheet,
              },
            );
            break;

          case DevRoutes.AMOUNT_AND_MEMO_MODAL:
            showModal(
              AmountAndMemoModal,
              {
                title: 'test',
                amountLimitConfig: {
                  mode: AmountLimit.UserBalance,
                },
                // eslint-disable-next-line no-console
                onSelect: console.log,
              },
              {
                mode: ModalMode.BottomSheet,
              },
            );
            break;
          case DevRoutes.LOADING_MODAL:
            showModal(LoadingModal, {
              text: 'test',
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

  const clearSecureStorage = React.useCallback(() => {
    resetSecureStorage();
  }, []);

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

      {/* Display the current application feature flags */}
      <Typography.Subtitle>Feature flags</Typography.Subtitle>
      <Typography.Caption>{JSON.stringify(appFeatureFlags, undefined, 4)}</Typography.Caption>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={navigateToLandingPage}>
        Go to landing page
      </Button>

      <Spacer paddingVertical={4} />

      <Button
        mode="contained"
        onPress={() => handleUriAction(uriAction)}
        disabled={uriAction === undefined}
      >
        Handle Uri Action
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={clearSecureStorage}>
        Clear secure storage
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={testPostHogEvent}>
        Send PostHog test event
      </Button>

      <Spacer paddingVertical={4} />

      <Button mode="contained" onPress={testSentry}>
        Test Sentry
      </Button>
    </StyledSafeAreaView>
  );
};

export default DevScreen;
