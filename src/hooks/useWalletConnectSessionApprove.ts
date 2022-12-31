import { useCallback, useEffect, useState } from 'react';
import useDesmosClientContext from 'contexts/DesmosClientContext';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import { ConnectedEvent, Events } from 'types/walletconnect';

export type ApproveStatus = {
  approving: boolean;
  error?: string;
  approved?: boolean;
};

/**
 * Hook to accept the WalletConnect session.
 * Returns a stateful variable that provides the approve status and a function to approve the request.
 */
export default function useWalletConnectSessionApprove(): [
  ApproveStatus,
  (id: string, accounts: string[], chaiId: string) => void
] {
  const { controller } = useWalletConnectContext();
  const { desmosChains } = useDesmosClientContext();

  const [status, setStatus] = useState<ApproveStatus>({
    approving: false,
  });

  const onConnect = useCallback((event: ConnectedEvent) => {
    if (event.error === null) {
      setStatus({
        approving: false,
        approved: true,
      });
    } else {
      setStatus({
        approving: false,
        error: event.error.toString(),
      });
    }
  }, []);

  useEffect(() => {
    controller.addListener(Events.OnConnect, onConnect);
    return () => {
      controller.removeListener(Events.OnConnect, onConnect);
    };
  }, [controller, onConnect]);

  const approve = useCallback(
    (id: string, accounts: string[], chaiId: string) => {
      const chainsIndex = Object.keys(desmosChains).map(key => desmosChains[key].chainName).sort().indexOf(chaiId);
      setStatus({
        approving: true,
      });
      if (chainsIndex === -1) {
        setStatus({
          approving: false,
          error: `Can't find index for chain ${chaiId}.`,
        });
      } else {
        controller.approveSession(id, accounts, chainsIndex);
      }
    },
    [controller, desmosChains],
  );

  return [status, approve];
}
