import useWalletConnectContext from '../contexts/WalletConnectContext';

/**
 * Hook that provides a stateful variable of all the WalletConnect call requests.
 */
export default function useWalletCallRequests() {
  const { callRequests } = useWalletConnectContext();

  return callRequests;
}
