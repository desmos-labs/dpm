import { OfflineSigner } from '@cosmjs/proto-signing';
import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { useCallback } from 'react';
import { ChainLink } from 'types/chains';
import useCurrentChainInfo from './desmosclient/useCurrentChainInfo';
import useBroadcastMessages from './useBroadcastMessages';

export default function useDisconnectChainLink() {
  const chainInfo = useCurrentChainInfo();
  const broadcastMessages = useBroadcastMessages();

  return useCallback(
    async (wallet: OfflineSigner, chainLink: ChainLink) => {
      const accounts = await wallet.getAccounts();
      const msgs = [
        {
          typeUrl: '/desmos.profiles.v3.MsgUnlinkChainAccount',
          value: {
            chainLinkName: chainLink.chainLinkName,
            owner: accounts[0].address,
            target: chainLink.externalAddress,
          },
        } as MsgUnlinkChainAccountEncodeObject,
      ];

      const gas = '0';
      const fee = { amount: [], gas };
      await broadcastMessages(wallet, msgs, fee);
    },
    [broadcastMessages, chainInfo],
  );
}
