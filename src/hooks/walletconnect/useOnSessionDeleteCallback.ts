import { useRemoveSessionByTopic } from '@recoil/walletConnectSessions';
import { useCallback } from 'react';
import { SignClientTypes } from '@walletconnect/types';

const useOnSessionDelete = () => {
  const removeSessionByTopic = useRemoveSessionByTopic();
  return useCallback(
    (args: SignClientTypes.EventArguments['session_delete']) => {
      removeSessionByTopic(args.topic);
    },
    [removeSessionByTopic],
  );
};

export default useOnSessionDelete;
