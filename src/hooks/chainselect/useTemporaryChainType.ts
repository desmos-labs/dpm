import { ChainType } from 'types/chains';
import { useSetSetting, useSetting } from '@recoil/settings';
import React from 'react';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';

/**
 * Hook that changes the current chain until the component where this hook
 * is changed is unmounted.
 */
const useTemporaryChainType = (chainType?: ChainType) => {
  const setChainName = useSetSetting('chainName');
  const currentChainName = useSetting('chainName');

  const oldChainName = React.useMemo(
    () => currentChainName,
    // Safe to ignore, we want to memoize the first value so we can
    // restore it later one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  React.useEffect(() => {
    if (chainType) {
      const chainName =
        chainType === ChainType.Mainnet ? DesmosMainnet.chainName : DesmosTestnet.chainName;
      setChainName(chainName);
      return () => {
        setChainName(oldChainName);
      };
    }
    return undefined;
  }, [setChainName, oldChainName, chainType]);
};

export default useTemporaryChainType;
