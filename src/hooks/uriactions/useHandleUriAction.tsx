import React from 'react';
import {
  GenericActionUri,
  GenericActionsTypes,
  SendTokensActionUri,
  UriAction,
  UriActionType,
  UserAddressActionUri,
  ViewProfileActionUri,
} from 'types/uri';
import useShowModal from 'hooks/useShowModal';
import GenericUriActionModal from 'modals/GenericUriActionModal';
import { getCachedUriAction } from 'lib/UriActions';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';
import useRequestChainChange from 'hooks/chainselect/useRequestChainChange';
import { Trans } from 'react-i18next';
import { chainTypeToChainName } from 'lib/FormatUtils';
import Typography from 'components/Typography';

const useHandleGenericAction = () => {
  const showModal = useShowModal();

  return React.useCallback(
    (action: GenericActionUri | UserAddressActionUri) => {
      showModal(GenericUriActionModal, {
        action,
      });
    },
    [showModal],
  );
};

const useHandleViewProfileAction = () => {
  const requestChainChange = useRequestChainChange();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (action: ViewProfileActionUri | GenericActionUri) => {
      requestChainChange({
        message: (
          <Typography.Regular16>
            <Trans
              ns="uriActions"
              i18nKey="view profile on another network"
              values={{
                chain: chainTypeToChainName(action.chainType),
              }}
              components={[<Typography.SemiBold16 />]}
            />
          </Typography.Regular16>
        ),
        newChainType: action.chainType,
        onSuccess: () => {
          navigation.navigate(ROUTES.PROFILE, {
            visitingProfile: action.address,
          });
        },
      });
    },
    [navigation, requestChainChange],
  );
};

const useHandleSendTokensAction = () => {
  const requestChainChange = useRequestChainChange();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(
    (action: SendTokensActionUri | GenericActionUri) => {
      requestChainChange({
        message: (
          <Typography.Regular16>
            <Trans
              ns="uriActions"
              i18nKey="send action on another network"
              values={{
                chain: chainTypeToChainName(action.chainType),
              }}
              components={[<Typography.SemiBold16 />]}
            />
          </Typography.Regular16>
        ),
        newChainType: action.chainType,
        onSuccess: () => {
          navigation.navigate(ROUTES.SEND_TOKENS, {
            recipient: action.address,
            // @ts-ignore
            amount: action.amount,
          });
        },
      });
    },
    [navigation, requestChainChange],
  );
};

/**
 * Hook that provides a function that will handle the uri action
 * if present.
 */
const useHandleUriAction = () => {
  const handleGenericAction = useHandleGenericAction();
  const handleViewProfileAction = useHandleViewProfileAction();
  const handleSendTokensAction = useHandleSendTokensAction();

  return React.useCallback(
    (uriAction?: UriAction, genericActionOverride?: GenericActionsTypes) => {
      const action = uriAction ?? getCachedUriAction();
      if (action !== undefined) {
        let toHandleAction = action.type;
        if (toHandleAction === UriActionType.Generic && genericActionOverride !== undefined) {
          toHandleAction = genericActionOverride;
        }

        // In the following switch-cases we need to berform some casting
        // becouse ts is not able to infer the type of action
        // since we are performing the switch on another variable instead
        // of action.type.
        switch (toHandleAction) {
          case UriActionType.UserAddress:
          case UriActionType.Generic:
            handleGenericAction(action as GenericActionUri | UserAddressActionUri);
            break;
          case UriActionType.ViewProfile:
            handleViewProfileAction(action as ViewProfileActionUri | GenericActionUri);
            break;
          case UriActionType.SendTokens:
            handleSendTokensAction(action as SendTokensActionUri | GenericActionUri);
            break;
          default:
            break;
        }
      }
    },
    [handleGenericAction, handleSendTokensAction, handleViewProfileAction],
  );
};

export default useHandleUriAction;
