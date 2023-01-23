import React from 'react';
import { ChainLink } from 'types/desmos';
import useBroadcastTx, { BroadcastTxOptions } from 'hooks/useBroadcastTx';
import {
  MsgUnlinkChainAccountEncodeObject,
  MsgUnlinkChainAccountTypeUrl,
} from '@desmoslabs/desmjs';
import { useDeleteChainLink } from '@recoil/chainLinks';

/**
 * Hook that allows disconnecting the given chain link.
 * @param chainLink {ChainLink} - Chain link to be disconnected.
 * @param options {BroadcastTxOptions | undefined} - Options to be used when disconnecting the chain link.
 */
export const useDisconnectChainLink = (chainLink: ChainLink, options?: BroadcastTxOptions) => {
  const broadcastTx = useBroadcastTx();
  const deleteChainLink = useDeleteChainLink();

  return React.useCallback(async () => {
    const msg: MsgUnlinkChainAccountEncodeObject = {
      typeUrl: MsgUnlinkChainAccountTypeUrl,
      value: {
        chainName: chainLink.chainName,
        target: chainLink.externalAddress,
        owner: chainLink.userAddress,
      },
    };

    const onSuccess = () => {
      deleteChainLink(chainLink);
      if (options?.onSuccess) {
        options.onSuccess();
      }
    };

    await broadcastTx([msg], {
      ...options,
      onSuccess,
    });
  }, [chainLink, broadcastTx, options, deleteChainLink]);
};
