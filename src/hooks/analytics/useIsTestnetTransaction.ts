import { useSetting } from '@recoil/settings';
import React from 'react';
import { DesmosTestnet } from '@desmoslabs/desmjs';

/**
 * Hook that tells whether the current transaction is happening on the testnet or not.
 */
const useIsTestnetTransaction = () => {
  const chainName = useSetting('chainName');
  return React.useMemo(() => chainName === DesmosTestnet.chainName, [chainName]);
};

export default useIsTestnetTransaction;
