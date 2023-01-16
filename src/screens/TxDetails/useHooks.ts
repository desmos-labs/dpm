import React from 'react';
import { useCurrentChainInfo } from '@recoil/settings';
import { DesmosMainnet } from '@desmoslabs/desmjs';

export const useGetTransactionExplorerUrl = () => {
  const chainInfo = useCurrentChainInfo();
  return React.useCallback(
    (txHash: string) => {
      if (chainInfo.chainName === DesmosMainnet.chainName) {
        return `https://explorer.desmos.network/transactions/${txHash}`;
      }
      return `https://morpheus.desmos.network/transactions/${txHash}`;
    },
    [chainInfo],
  );
};
