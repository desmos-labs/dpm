import { useRemoveSessionByTopic } from '@recoil/walletConnectSessions';
import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';

const useWalletConnectOnSessionExpire = () => {
  const removeSessionByTopic = useRemoveSessionByTopic();
  return useCallback(
    (args: SignClientTypes.EventArguments['session_expire']) => {
      removeSessionByTopic(args.topic);
    },
    [removeSessionByTopic],
  );
};

export default useWalletConnectOnSessionExpire;
