import { useSetting } from '@recoil/settings';
import React from 'react';
import { DesmosTestnet } from '@desmoslabs/desmjs';

/**
 * Hook that provides a boolean that tels if we should avoid to
 * track the user event because it's interacting with the testnet.
 */
const useIsTestnetEvent = () => {
  const chainName = useSetting('chainName');

  return React.useMemo(() => {
    // In Development mode let's consider also events when we are
    // interacting with the testnet.
    if (__DEV__) {
      return false;
    }

    return chainName === DesmosTestnet.chainName;
  }, [chainName]);
};

export default useIsTestnetEvent;
