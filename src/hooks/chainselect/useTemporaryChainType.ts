import { ChainType } from 'types/chains';
import { useSetSetting, useSetting } from '@recoil/settings';
import React from 'react';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';
import { useNavigation } from '@react-navigation/native';

/**
 * Hook that changes the current chain until the screen where this hook
 * has been called is in the navigation stack.
 */
const useTemporaryChainType = (chainType?: ChainType) => {
  const navigation = useNavigation();
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
    }
  }, [setChainName, oldChainName, chainType]);

  React.useEffect(
    () =>
      navigation.addListener('beforeRemove', () => {
        console.log('restore chain', oldChainName);
        setChainName(oldChainName);
      }),
    [navigation, oldChainName, setChainName],
  );
};

export default useTemporaryChainType;
