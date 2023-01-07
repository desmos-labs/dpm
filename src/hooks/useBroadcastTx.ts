import { EncodeObject } from '@cosmjs/proto-signing';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import { useReturnToCurrentScreen } from 'hooks/useReturnToCurrentScreen';

export interface BroadcastTxCallbacks {
  onSuccess?: () => void;
  onCancel?: () => void;
  onError?: () => void;
}

export interface BroadcastTxOptions extends BroadcastTxCallbacks {
  memo?: string;
}

/**
 * Hook that provides a function used to sign and broadcast a transaction.
 */
const useBroadcastTx = (): ((msgs: EncodeObject[], options?: BroadcastTxOptions) => void) => {
  const navigation = useNavigation<StackNavigationProp<RootNavigatorParamList>>();
  const { returnToCurrentScreen } = useReturnToCurrentScreen();

  return useCallback(
    (msgs: EncodeObject[], options?: BroadcastTxOptions) => {
      navigation.navigate({
        name: ROUTES.BROADCAST_TX,
        params: {
          messages: msgs,
          memo: options?.memo,
          onSuccess: () => {
            returnToCurrentScreen();
            if (options?.onSuccess !== undefined) {
              options.onSuccess();
            }
          },
          onCancel: () => {
            returnToCurrentScreen();
            if (options?.onCancel !== undefined) {
              options.onCancel();
            }
          },
          onError: () => {
            returnToCurrentScreen();
            if (options?.onError !== undefined) {
              options.onError();
            }
          },
        },
      });
    },
    [navigation, returnToCurrentScreen],
  );
};

export default useBroadcastTx;
