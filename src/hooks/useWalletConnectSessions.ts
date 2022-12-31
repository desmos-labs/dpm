import { useCallback, useEffect, useState } from 'react';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import { ChainAccount } from 'types/chain';
import { Events, Session } from 'types/walletconnect';

/**
 * Hook that provides a stateful variable to the active WalletConnect session of a ChainAccount.
 */
export default function useWalletConnectSessions(account: ChainAccount): Session[] {
  const { controller } = useWalletConnectContext();
  const [sessions, setSessions] = useState(controller.sessions);

  const onChange = useCallback(() => {
    setSessions(
      controller.sessions.filter((session) => session.accounts.indexOf(account.address) !== -1),
    );
  }, [controller, account]);

  useEffect(() => {
    controller.addListener(Events.OnDisconnect, onChange);
    controller.addListener(Events.OnConnect, onChange);
    controller.addListener(Events.OnSessionUpdate, onChange);
    return () => {
      controller.removeListener(Events.OnDisconnect, onChange);
      controller.removeListener(Events.OnConnect, onChange);
      controller.removeListener(Events.OnSessionUpdate, onChange);
    };
  }, [controller, onChange]);

  useEffect(() => {
    onChange();
  }, [account, onChange]);

  return sessions;
}
