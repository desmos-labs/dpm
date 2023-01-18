import { EncodeObject } from '@cosmjs/proto-signing';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import ROUTES from 'navigation/routes';
import { RootNavigatorParamList } from 'navigation/RootNavigator';

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
  return useCallback(
    (msgs: EncodeObject[], options?: BroadcastTxOptions) => {
      navigation.navigate(ROUTES.BROADCAST_TX, {
        messages: msgs,
        memo: options?.memo,
        onSuccess: options?.onSuccess,
        onCancel: options?.onCancel,
        onError: options?.onError,
      });
    },
    [navigation],
  );
};

export default useBroadcastTx;
