import { EncodeObject } from '@cosmjs/proto-signing';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { AccountScreensStackParams } from 'types/navigation';

export interface BroadcastTxOptions {
  onSuccess?: () => void;
  onError?: () => void;
}

/**
 * Hook that provides a function used to sign and broadcast a transaction.
 */
const useBroadcastTx = (): ((msgs: EncodeObject[], options?: BroadcastTxOptions) => void) => {
  const navigation = useNavigation<StackNavigationProp<AccountScreensStackParams>>();
  return useCallback(
    async (msgs: EncodeObject[], options?: BroadcastTxOptions) => {
      console.log(msgs);
      if (options?.onSuccess) {
        options?.onSuccess();
      }
    },
    [navigation],
  );
};

export default useBroadcastTx;
