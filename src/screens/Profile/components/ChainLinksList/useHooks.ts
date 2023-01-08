import { Account, AccountWithWallet } from 'types/account';
import { useCallback } from 'react';
import { useImportAccount } from 'hooks/useImportAccount';
import LinkableChains from 'config/LinkableChains';
import { toHex } from '@cosmjs/encoding';
import { StdFee } from '@cosmjs/amino';
import {
  Proof,
  SignatureValueType,
  SingleSignature,
} from '@desmoslabs/desmjs-types/desmos/profiles/v3/models_chain_links';
import { Any } from 'cosmjs-types/google/protobuf/any';
import { PubKey } from 'cosmjs-types/cosmos/crypto/secp256k1/keys';
import {
  getPubKeyRawBytes,
  getSignatureBytes,
  getSignedBytes,
  MsgLinkChainAccountEncodeObject,
  MsgLinkChainAccountTypeUrl,
  SigningMode,
} from '@desmoslabs/desmjs';
import { SignerData } from '@cosmjs/stargate';
import { SupportedChain } from 'types/chains';
import { singleSignatureToAny } from '@desmoslabs/desmjs/build/aminomessages/profiles';
import { getAddress } from 'lib/ChainsUtils';
import useBroadcastTx from 'hooks/useBroadcastTx';
import { useActiveAccount } from '@recoil/activeAccountState';
import useSignTx, { OfflineSignResult, SignMode } from 'hooks/useSignTx';

const useSaveChainLinkAccount = () =>
  useCallback(async (chain: SupportedChain, account: AccountWithWallet) => {
    // TODO: Implement this
    console.log('Implement useSaveChainLinkAccount', account);
  }, []);

/**
 * Hook used to generate the proof used to link an external wallet to a Desmos Profile.
 */
const useGenerateProof = () => {
  const signTx = useSignTx();

  return useCallback(
    async (desmosAccount: Account, chain: SupportedChain, account: AccountWithWallet) => {
      const fees: StdFee = {
        gas: '0',
        amount: [],
      };
      const signerData: SignerData = {
        accountNumber: 0,
        chainId: chain.name,
        sequence: 0,
      };

      const { signatureResult } = <OfflineSignResult>await signTx(account.wallet, {
        mode: SignMode.Offline,
        messages: [],
        fees,
        signerData,
        memo: desmosAccount.address,
      });

      const pubKeyBytes = getPubKeyRawBytes(signatureResult);
      const signatureBytes = getSignatureBytes(signatureResult);
      const signedBytes = getSignedBytes(signatureResult);

      const proofPlainText = toHex(signedBytes);
      const proofSignature = singleSignatureToAny(
        SingleSignature.fromPartial({
          valueType:
            account.wallet.signer.signingMode === SigningMode.DIRECT
              ? SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_DIRECT
              : SignatureValueType.SIGNATURE_VALUE_TYPE_COSMOS_AMINO,
          signature: signatureBytes,
        }),
      );
      const proofPubKey = Any.fromPartial({
        typeUrl: '/cosmos.crypto.secp256k1.PubKey',
        value: PubKey.encode(
          PubKey.fromPartial({
            key: pubKeyBytes,
          }),
        ).finish(),
      });

      return Proof.fromPartial({
        signature: proofSignature,
        plainText: proofPlainText,
        pubKey: proofPubKey,
      });
    },
    [signTx],
  );
};

/**
 * Hook used to generate a MsgLinkChainAccount message used to link an external chain to a Desmos Profile.
 */
const useGenerateMsgLinkChainAccount = () => {
  const generateProof = useGenerateProof();
  const activeAccount = useActiveAccount();

  return useCallback(
    async (chain: SupportedChain, account: AccountWithWallet) => {
      if (!activeAccount) {
        return undefined;
      }

      const address = getAddress(chain, account);
      const proof = await generateProof(activeAccount, chain, account);
      return {
        typeUrl: MsgLinkChainAccountTypeUrl,
        value: {
          proof,
          chainConfig: chain.chainConfig,
          signer: activeAccount.address,
          chainAddress: address,
        },
      } as MsgLinkChainAccountEncodeObject;
    },
    [generateProof, activeAccount],
  );
};

/**
 * Hook used to start the connection to an external chain.
 * @param onSuccess - Callback used when the entire process end successfully.
 */
const useConnectChain = (onSuccess: () => void) => {
  const { importAccount } = useImportAccount(LinkableChains);
  const generateMsgChainLink = useGenerateMsgLinkChainAccount();
  const broadcastTx = useBroadcastTx();
  const saveChainLinkAccount = useSaveChainLinkAccount();

  const connectChain = useCallback(async () => {
    const accountWithChain = await importAccount();
    if (accountWithChain === undefined) {
      return;
    }

    const { account, chain } = accountWithChain;

    const message = await generateMsgChainLink(chain, account);
    if (!message) {
      return;
    }

    broadcastTx([message], {
      onSuccess: () => {
        saveChainLinkAccount(chain, account);
        onSuccess();
      },
    });
  }, [broadcastTx, generateMsgChainLink, importAccount, onSuccess, saveChainLinkAccount]);

  return {
    connectChain,
  };
};

export default useConnectChain;
