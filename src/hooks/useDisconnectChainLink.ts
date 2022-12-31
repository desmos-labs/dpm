import { OfflineSigner } from '@cosmjs/proto-signing';
import { MsgUnlinkChainAccountEncodeObject } from '@desmoslabs/desmjs';
import { useCallback } from 'react';
import { computeTxFees, messagesGas } from 'types/fees';
import { ChainLink } from 'types/link';
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
            chainName: chainLink.chainName,
            owner: accounts[0].address,
            target: chainLink.externalAddress,
          },
        } as MsgUnlinkChainAccountEncodeObject,
      ];

      const gas = messagesGas(msgs);
      const fee = computeTxFees(gas, chainInfo.stakeCurrency.coinDenom).average;
      await broadcastMessages(wallet, msgs, fee);
    },
    [broadcastMessages, chainInfo],
  );
}
