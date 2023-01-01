import { useCallback, useState } from 'react';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import { SessionRequestDetails } from 'types/walletconnect';

export type PairStatus = {
  pairing: boolean;
  requestDetails?: SessionRequestDetails;
  error?: string;
};

/**
 * Hook that provides a function to initiate the pairing procedure with a
 * DApp that use WalletConnect.
 */
export default function useWalletConnectPair(): [PairStatus, (uri: string) => Promise<void>] {
  const { controller } = useWalletConnectContext();
  const [pairStatus, setPairStatus] = useState<PairStatus>({
    pairing: false,
  });

  const connectToDapp = useCallback(
    async (uri: string, timeoutMs?: number): Promise<void> => {
      setPairStatus({
        pairing: true,
      });
      try {
        const sessionRequestDetails = await controller.connectToDApp(uri, timeoutMs);
        setPairStatus({
          pairing: false,
          requestDetails: sessionRequestDetails,
        });
      } catch (e) {
        setPairStatus({
          pairing: false,
          error: e.toString(),
        });
      }
    },
    [controller],
  );

  return [pairStatus, connectToDapp];
}
