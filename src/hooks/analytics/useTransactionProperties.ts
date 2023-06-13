import React from 'react';
import useIsTestnetTransaction from 'hooks/analytics/useIsTestnetTransaction';

/**
 * Hook that returns the properties that should be attached to the transaction events.
 */
const useTransactionProperties = () => {
  const isTestnetTransaction = useIsTestnetTransaction();
  return React.useMemo(
    () => ({
      Chain: isTestnetTransaction ? 'Testnet' : 'Mainnet',
    }),
    [isTestnetTransaction],
  );
};

export default useTransactionProperties;
