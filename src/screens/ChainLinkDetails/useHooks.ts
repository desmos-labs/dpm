import React from 'react';
import { ChainLink } from 'types/desmos';
import useBroadcastTx, { BroadcastTxOptions } from 'hooks/useBroadcastTx';
import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';

/**
 * Hook that allows disconnecting the given chain link.
 * @param chainLink {ChainLink} - Chain link to be disconnected.
 * @param options {BroadcastTxOptions | undefined} - Options to be used when disconnecting the chain link.
 */
export const useDisconnectChainLink = (chainLink: ChainLink, options?: BroadcastTxOptions) => {
  const broadcastTx = useBroadcastTx();

  return React.useCallback(async () => {
    const msg: MsgUnlinkChainAccountEncodeObject = {
      typeUrl: '/desmos.profiles.v3.MsgUnlinkChainAccount',
      value: {
        chainName: chainLink.chainName,
        target: chainLink.externalAddress,
        owner: chainLink.userAddress,
      },
    };

    await broadcastTx([msg], options);
  }, [chainLink, broadcastTx, options]);
};
