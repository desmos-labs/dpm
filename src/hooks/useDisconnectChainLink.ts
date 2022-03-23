import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { useCallback } from 'react';
import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/sdk-core';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { ChainLink } from '../types/link';
import { computeTxFees, messagesGas } from '../types/fees';
import useBroadcastMessages from './useBroadcastMessages';

export default function useDisconnectChainLink() {
  const chainInfo = useCurrentChainInfo();
  const broadcastMessages = useBroadcastMessages();

  return useCallback(
    async (wallet: OfflineSigner, chainLink: ChainLink) => {
      const accounts = await wallet.getAccounts();
      const msgs = [
        {
          typeUrl: '/desmos.profiles.v1beta1.MsgUnlinkChainAccount',
          value: {
            chainName: chainLink.chainName,
            owner: accounts[0].address,
            target: chainLink.externalAddress,
          },
        } as MsgUnlinkChainAccountEncodeObject,
      ];

      const gas = messagesGas(msgs);
      const fee = computeTxFees(gas, chainInfo.coinDenom).average;
      await broadcastMessages(wallet, msgs, fee);
    },
    [broadcastMessages, chainInfo]
  );
}
