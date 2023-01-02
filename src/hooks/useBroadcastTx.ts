import { EncodeObject } from '@cosmjs/proto-signing';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useCallback } from 'react';
import { ChainAccount } from 'types/chains';
import { AccountScreensStackParams } from 'types/navigation';

/**
 * Hooks that provides a function that sign and broadcast a transaction.
 * The returned function shows to the user the transaction that will be broadcasted.
 */
function useBroadcastTx(): (
  signer: ChainAccount,
  msgs: EncodeObject[]
) => Promise<void> {
  const navigation = useNavigation<StackNavigationProp<AccountScreensStackParams>>();

  return useCallback(
    async (signer: ChainAccount, msgs: EncodeObject[]) =>
      new Promise((resolve, reject) => {
        navigation.navigate({
          name: 'BroadcastTx',
          params: {
            signer,
            msgs,
            onSuccess: resolve,
            onCancel: reject,
          },
        });
      }),
    [navigation],
  );
}

export default useBroadcastTx;
