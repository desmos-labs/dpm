import { useCallback, useState } from 'react';
import useWalletConnectContext from '../contexts/WalletConnectContext';

export type RejectStatus = {
  rejecting: boolean;
  rejected?: boolean;
  error?: string;
};

/**
 * Hook to reject the WalletConnect requests.
 * Returns a stateful variable that provides the reject status and a function to reject the request.
 */
export default function useWalletConnectSessionReject(): [
  RejectStatus,
  (sessionId: string, message?: string) => void
] {
  const { controller } = useWalletConnectContext();
  const [status, setStatus] = useState<RejectStatus>({
    rejecting: false,
  });

  const reject = useCallback(
    (sessionId: string, message?: string) => {
      setStatus({
        rejecting: true,
      });
      try {
        controller.rejectSession(sessionId, message);
        setStatus({
          rejecting: false,
          rejected: true,
        });
      } catch (e) {
        setStatus({
          rejecting: false,
          error: e.toString(),
        });
      }
    },
    [controller],
  );

  return [status, reject];
}
