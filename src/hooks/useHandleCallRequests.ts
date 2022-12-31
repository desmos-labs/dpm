import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect } from 'react';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import { AccountScreensStackParams } from 'types/navigation';

/**
 * Hook to observe the WalletConnect call request and present them
 * to the user.
 */
export default function useHandleCallRequests() {
  const { callRequests } = useWalletConnectContext();
  const navigation = useNavigation<NavigationProp<AccountScreensStackParams>>();
  const requestsAvailable = callRequests.length > 0;

  useEffect(() => {
    if (requestsAvailable) {
      navigation.navigate({
        name: 'WalletConnectCallRequest',
        params: undefined,
      });
    }
  }, [requestsAvailable, navigation]);
}
