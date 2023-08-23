import React from 'react';
import { UriActionType } from 'types/uri';
import useShowModal from 'hooks/useShowModal';
import GenericUriActionModal from 'modals/GenericUriActionModal';
import { getCachedUriAction } from 'lib/UriActions';
import { useNavigation } from '@react-navigation/native';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { StackNavigationProp } from '@react-navigation/stack';
import ROUTES from 'navigation/routes';

/**
 * Hook that provides a function that will handle the uri action
 * if present.
 */
const useHandleUriAction = () => {
  const showModal = useShowModal();
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();

  return React.useCallback(() => {
    const action = getCachedUriAction();
    if (action !== undefined) {
      switch (action.type) {
        case UriActionType.UserAddress:
        case UriActionType.Generic:
          showModal(GenericUriActionModal, {
            action,
          });
          break;
        case UriActionType.ViewProfile:
          navigation.navigate(ROUTES.PROFILE, {
            visitingProfile: action.address,
            chainType: action.chainType,
          });
          break;
        case UriActionType.SendTokens:
          navigation.navigate(ROUTES.SEND_TOKENS, {
            recipient: action.address,
            chainType: action.chainType,
            amount: action.amount,
          });
          break;
        default:
          // @ts-ignore
          console.error(`Unsupported uri type: ${action.type}`);
          break;
      }
    }
  }, [navigation, showModal]);
};

export default useHandleUriAction;
