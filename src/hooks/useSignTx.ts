import { StdFee } from '@cosmjs/amino';
import { EncodeObject } from '@cosmjs/proto-signing';
import { useCallback } from 'react';
import { Wallet, WalletType } from 'types/wallet';
import { DeliverTxResponse, DesmosClient, SignatureResult } from '@desmoslabs/desmjs';
import { useCurrentChainGasPrice, useCurrentChainInfo } from '@recoil/settings';
import { useModal } from 'hooks/useModal';
import LoadingModal from 'modals/LoadingModal';
import { useTranslation } from 'react-i18next';
import { SignerData } from '@cosmjs/stargate';

/**
 * Type of signature result.
 */
export enum SignMode {
  /**
   * Signature made offline without querying the chain for the
   * account sequence number and fee estimation.
   */
  Offline,
  /**
   * Sig
   */
  SignAndBroadcast,
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
export interface SignAndBroadcastParams {
  readonly mode: SignMode.SignAndBroadcast;
  readonly messages: EncodeObject[];
  readonly fees?: StdFee | 'auto';
  readonly memo?: string;
}

export type SignParams = OfflineSignParams | SignAndBroadcastParams;

export interface OfflineSignResult {
  readonly mode: SignMode.Offline;
  readonly signatureResult: SignatureResult;
}

export interface SignAndBroadcastResult {
  readonly mode: SignMode.SignAndBroadcast;
  readonly deliverTxResponse: DeliverTxResponse;
}

export type SignResult = OfflineSignResult | SignAndBroadcastResult;

function useGetClientFromSignMode() {
  const { rpcUrl } = useCurrentChainInfo();
  const gasPrice = useCurrentChainGasPrice();

  return useCallback(
    async (signMode: SignMode, { signer, addressPrefix }: Wallet) => {
      switch (signMode) {
        case SignMode.Offline:
          return DesmosClient.offline(signer, {
            prefix: addressPrefix,
          });
        case SignMode.SignAndBroadcast:
          return DesmosClient.connectWithSigner(rpcUrl, signer, {
            prefix: addressPrefix,
            gasPrice,
          });
        default:
          throw new Error(`can't build client for sign mode ${signMode}`);
      }
    },
    [rpcUrl, gasPrice],
  );
}

const useSignOfflineTx = () =>
  useCallback(
    async (
      client: DesmosClient,
      wallet: Wallet,
      signParams: OfflineSignParams,
    ): Promise<SignResult> =>
      client
        .signTx(
          wallet.address,
          signParams.messages,
          signParams.fees,
          signParams.memo,
          signParams.signerData,
        )
        .then((signatureResult) => ({
          mode: SignMode.Offline,
          signatureResult,
        })),
    [],
  );

const useSignAndBroadcastTx = () =>
  useCallback(
    async (
      client: DesmosClient,
      wallet: Wallet,
      signParams: SignAndBroadcastParams,
    ): Promise<SignResult> =>
      client
        .signAndBroadcast(
          wallet.address,
          signParams.messages,
          signParams.fees ?? 'auto',
          signParams.memo,
        )
        .then((deliverTxResponse) => ({
          mode: SignMode.SignAndBroadcast,
          deliverTxResponse,
        })),
    [],
  );

/**
 * Hook that provides a function to sign a transaction.
 */
export default function useSignTx() {
  const getClientFromSignMode = useGetClientFromSignMode();
  const { t } = useTranslation();
  const { showModal, hideModal } = useModal();
  const signAndBroadcastTx = useSignAndBroadcastTx();
  const signOfflineTx = useSignOfflineTx();

  return useCallback(
    async (wallet: Wallet, signParams: SignParams) => {
      const client = await getClientFromSignMode(signParams.mode, wallet);

      if (wallet.type === WalletType.Ledger) {
        showModal(LoadingModal, {
          text: t('waiting ledger confirmation'),
        });
      }

      let signPromise;

      switch (signParams.mode) {
        case SignMode.SignAndBroadcast:
          signPromise = signAndBroadcastTx(client, wallet, signParams);
          break;
        case SignMode.Offline:
          signPromise = signOfflineTx(client, wallet, signParams);
          break;
        default:
          // @ts-ignore
          signPromise = Promise.reject(new Error(`unknown signMode ${signParams.mode}`));
          break;
      }

      return signPromise.finally(() => {
        client.disconnect();
        if (wallet.type === WalletType.Ledger) {
          hideModal();
        }
      });
    },
    [getClientFromSignMode, hideModal, showModal, signAndBroadcastTx, signOfflineTx, t],
  );
}
