import { useCurrentChainInfo } from '@recoil/settings';
import React from 'react';
import { DesmosClient, SignatureResult, TxRaw } from '@desmoslabs/desmjs';
import { Wallet } from 'types/wallet';
import { err, ResultAsync } from 'neverthrow';
import { useTranslation } from 'react-i18next';
import useModal from 'hooks/useModal';
import LoadingModal from 'modals/LoadingModal';

export default function useBroadcastTx() {
  const { t } = useTranslation('transaction');
  const { showModal, hideModal } = useModal();
  const chainInfo = useCurrentChainInfo();

  return React.useCallback(
    async (wallet: Wallet, signatureResult: SignatureResult) => {
      const connectToClientResult = await ResultAsync.fromPromise(
        DesmosClient.connectWithSigner(chainInfo.rpcUrl, wallet.signer),
        (e: any) => Error(`failed to connect to ${chainInfo.rpcUrl}: ${e}`),
      );

      // Connection to the chain failed, return error.
      if (connectToClientResult.isErr()) {
        return err(connectToClientResult.error);
      }

      const client = connectToClientResult.value;

      showModal(LoadingModal, {
        text: t('broadcasting tx'),
      });

      // Broadcast the transaction.
      const broadcastResult = await ResultAsync.fromPromise(
        client.broadcastTx(TxRaw.encode(signatureResult.txRaw).finish()),
        (e: any) => Error(`failed to broadcast tx: ${e}`),
      );

      hideModal();

      return broadcastResult;
    },
    [chainInfo.rpcUrl, hideModal, showModal, t],
  );
}
