import { StdFee } from '@cosmjs/amino';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { Button, StyledSafeAreaView, TopBar } from '../components';
import { TxDetails } from '../components/tx/TxDetails';
import { useWalletConnectContext } from '../contexts/WalletConnectContext';
import useShowModal from '../hooks/useShowModal';
import useSignTx from '../hooks/useSignTx';
import useUnlockWallet from '../hooks/useUnlockWallet';
import useWalletCallRequests from '../hooks/useWalletCallRequests';
import useWalletConnectRejectRequest from '../hooks/useWalletConnectRejectRequest';
import { LoadingModal } from '../modals/LodingModal';
import { SingleButtonModal } from '../modals/SingleButtonModal';
import AccountSource from '../sources/AccountSource';
import { makeStyle } from '../theming';
import { ChainAccountType } from '../types/chain';
import { CosmosMethod } from '../types/jsonRpCosmosc';
import { AccountScreensStackParams } from '../types/navigation';
import { CosmosTx } from '../types/tx';
import { CallRequestType, ParsedCallRequest } from '../types/walletconnect';

export type Props = StackScreenProps<AccountScreensStackParams, 'WalletConnectCallRequest'>;

export const WalletConnectCallRequest: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [signing, setSigning] = useState(false);
  const { controller, removeCallRequest } = useWalletConnectContext();
  const rejectRequest = useWalletConnectRejectRequest();
  const callRequests = useWalletCallRequests();
  const unlockWallet = useUnlockWallet();
  const signTx = useSignTx();
  const showModal = useShowModal();

  const request: ParsedCallRequest | null = useMemo(() => {
    if (callRequests.length > 0) {
      return callRequests[0];
    }
    return null;
  }, [callRequests]);

  const stdFee: StdFee | undefined = useMemo(() => {
    if (request !== null) {
      if (request.type === CallRequestType.SignDirect && request.signDoc.authInfo.fee) {
        const { amount, gasLimit } = request.signDoc.authInfo.fee;
        return {
          amount: amount.map((c) => ({ amount: c.amount, denom: c.denom })),
          gas: gasLimit.toString(),
        };
      }
      if (request.type === CallRequestType.SignAmino) {
        return request.signDoc.fee;
      }
      return undefined;
    }
    return undefined;
  }, [request]);

  const memo = useMemo(() => {
    if (request !== null) {
      if (request.type === CallRequestType.SignDirect) {
        return request.signDoc.body.memo;
      }
      if (request.type === CallRequestType.SignAmino) {
        return request.signDoc.memo;
      }
      return undefined;
    }
    return undefined;
  }, [request]);

  const messages = useMemo(() => {
    if (request !== null) {
      if (request.type === CallRequestType.SignDirect) {
        return request.signDoc.body.messages;
      }
      if (request.type === CallRequestType.SignAmino) {
        return request.signDoc.msgs;
      }
      return [];
    }
    return [];
  }, [request]);

  const onReject = useCallback(() => {
    rejectRequest(
      // FIXME i'm not sure about this cast (type assertion)
      request?.sessionId as string,
      request?.requestId as number,
      'Rejected from the user'
    );
  }, [request, rejectRequest]);

  const onApprove = useCallback(async () => {
    if (
      request !== null &&
      (request.type === CallRequestType.SignAmino || request.type === CallRequestType.SignDirect)
    ) {
      const signMethod =
        request.type === CallRequestType.SignAmino
          ? CosmosMethod.SignAmino
          : CosmosMethod.SignDirect;
      const account = await AccountSource.getAccount(request?.signerAddress);
      let closeModal: undefined | (() => void);

      if (account !== null) {
        try {
          const wallet = await unlockWallet(account);
          if (wallet !== null) {
            setSigning(true);
            if (account.type === ChainAccountType.Ledger) {
              closeModal = showModal(LoadingModal, {
                text: t('waiting ledger confirmation'),
              });
            }
            const signature = await signTx(wallet, {
              method: signMethod,
              tx: request?.signDoc,
            } as CosmosTx);
            if (closeModal !== undefined) {
              closeModal();
            }
            controller.approveSignRequest(request?.sessionId, request?.requestId, signature);
            removeCallRequest(request?.requestId);
          }
        } catch (e) {
          const error = e.toString();
          setSigning(false);
          if (closeModal) {
            closeModal();
          }
          showModal(SingleButtonModal, {
            image: 'fail',
            title: t('error'),
            message: error,
            actionLabel: t('cancel'),
            action: () => {
              rejectRequest(request?.sessionId, request?.requestId, error);
            },
          });
        }
      }
    }
  }, [request, unlockWallet, signTx, controller, removeCallRequest, showModal, t, rejectRequest]);

  useEffect(() => {
    if (request === null) {
      navigation.goBack();
    }
  }, [request, navigation]);

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK' && request !== null) {
          e.preventDefault();
        }
      }),
    [navigation, request]
  );

  return request !== null ? (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} title={t('tx details')} />}
      divider
      padding={0}
    >
      <TxDetails style={styles.txDetails} messages={messages} fee={stdFee} memo={memo} />
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} mode="contained" accent onPress={onReject} disabled={signing}>
          {t('reject')}
        </Button>
        <Button
          style={styles.button}
          mode="contained"
          onPress={onApprove}
          disabled={signing}
          loading={signing}
        >
          {t('approve')}
        </Button>
      </View>
    </StyledSafeAreaView>
  ) : null;
};

const useStyles = makeStyle((theme) => ({
  txDetails: {
    flex: 1,
  },
  buttonsContainer: {
    marginVertical: theme.spacing.m,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    width: '40%',
  },
}));
