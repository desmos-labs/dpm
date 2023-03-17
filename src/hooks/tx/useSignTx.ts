import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import React, { useCallback } from 'react';
import { Wallet, WalletType } from 'types/wallet';
import { DesmosClient, SignatureResult, SignTxOptions } from '@desmoslabs/desmjs';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import useModal from 'hooks/useModal';
import { useTranslation } from 'react-i18next';
import { SignerData } from '@cosmjs/stargate';
import LoadingModal from 'modals/LoadingModal';
import { err, Result, ResultAsync } from 'neverthrow';

/**
 * Type of signature result.
 */
export enum SignMode {
  /**
   * Signature made offline without querying the chain for the
   * account sequence number.
   */
  Offline,
  /**
   * Signature made querying the user sequence number from the chain.
   */
  Online,
}

/**
 * Parameters required to perform an offline signature.
 */
export interface OfflineSignParams {
  readonly mode: SignMode.Offline;
  readonly messages: EncodeObject[];
  readonly fees: StdFee;
  readonly signerData: SignerData;
  readonly memo?: string;
}

/**
 * Parameters required to perform an offline signature.
 */
export interface OnlineSignParams {
  readonly mode: SignMode.Online;
  readonly messages: EncodeObject[];
  readonly fees: StdFee;
  readonly memo?: string;
}

export type SignParams = OfflineSignParams | OnlineSignParams;

const useGetClientFromSignMode = () => {
  const { rpcUrl } = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (signMode: SignMode, { signer }: Wallet) => {
      switch (signMode) {
        case SignMode.Offline:
          return ResultAsync.fromPromise(DesmosClient.offline(signer), (e) =>
            Error(`error while initializing the client: ${e}`),
          );
        case SignMode.Online:
          return ResultAsync.fromPromise(
            DesmosClient.connectWithSigner(rpcUrl, signer, {
              gasPrice,
            }),
            (e) => Error(`error while initializing the client: ${e}`),
          );
        default:
          return err(Error(`can't build client for sign mode ${signMode}`));
      }
    },
    [rpcUrl, gasPrice],
  );
};

/**
 * Hook that provides a function to sign a transaction.
 */
export default function useSignTx() {
  const getClientFromSignMode = useGetClientFromSignMode();
  const { t } = useTranslation('transaction');
  const { showModal, hideModal } = useModal();

  return React.useCallback(
    async (wallet: Wallet, signParams: SignParams): Promise<Result<SignatureResult, Error>> => {
      showModal(LoadingModal, {
        text: t(wallet.type === WalletType.Ledger ? 'waiting ledger confirmation' : 'signing tx'),
      });

      const getClientResult = await getClientFromSignMode(signParams.mode, wallet);
      if (getClientResult.isErr()) {
        hideModal();
        return err(getClientResult.error);
      }

      let signTxOptions: SignTxOptions;
      switch (signParams.mode) {
        case SignMode.Online:
          signTxOptions = {
            memo: signParams.memo,
            fee: signParams.fees,
          };
          break;
        case SignMode.Offline:
          signTxOptions = {
            memo: signParams.memo,
            fee: signParams.fees,
            signerData: signParams.signerData,
          };
          break;
        default:
          // @ts-ignore
          return err(Error(`unknown signMode ${signParams.mode}`));
      }

      const client = getClientResult.value;
      const signResult = await ResultAsync.fromPromise(
        client.signTx(wallet.address, signParams.messages, signTxOptions),
        (e: any) => Error(e?.message ?? 'an unknown error occurred during the signature'),
      );
      client.disconnect();
      hideModal();

      return signResult;
    },
    [getClientFromSignMode, hideModal, showModal, t],
  );
}
