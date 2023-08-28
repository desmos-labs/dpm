import React from 'react';
import { UriActionType } from 'types/uri';
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

/**
 * Hook that provides a function that will handle the uri action
 * if present.
 */
const useHandleUriAction = () => {
  const showModal = useShowModal();
  const requestChainChange = useRequestChainChange();
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
          break;
        case UriActionType.SendTokens:
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
                amount: action.amount,
              });
            },
          });
          break;
        default:
          break;
      }
    }
  }, [navigation, requestChainChange, showModal]);
};

export default useHandleUriAction;
