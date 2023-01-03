import {NavigationAction, useNavigation} from '@react-navigation/native';
import {ChainInfo} from '@desmoslabs/desmjs';
import {useCallback} from 'react';
import {AccountScreensStackParams} from 'types/navigation';
import {StackNavigationProp} from '@react-navigation/stack/lib/typescript/src/types';
import {StackNavigationState} from '@react-navigation/routers/lib/typescript/src/StackRouter';

const useConfirmTx = (
  chainInfo: ChainInfo,
  feeGranter?: string,
  backAction?: ((state: StackNavigationState<any>) => NavigationAction) | NavigationAction,
) => {
  const navigation = useNavigation<StackNavigationProp < AccountScreensStackParams >>();

  return useCallback((msg: any, successAction: () => void) => {
    const messages = [msg];
    const gas = '0';
    const fee = { amount: [], gas };
    navigation.navigate({
      name: 'ConfirmTx',
      params: {
        messages,
        fee,
        feeGranter,
        backAction,
        successAction,
      },
    });
  }, [chainInfo, feeGranter, backAction]);
};

export default useConfirmTx;
