import { StdFee } from '@cosmjs/amino';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import {createDesmosTypes} from '@desmoslabs/desmjs';
import {AminoTypes} from '@cosmjs/stargate';
import {EncodeObject} from '@cosmjs/proto-signing';
import SingleButtonModal from 'modals/SingleButtonModal';
import TransactionDetails from 'components/TransactionDetails';
import useWalletConnectContext from 'contexts/WalletConnectContext';
import useShowModal from 'hooks/useShowModal';
import useSignTx from 'hooks/useSignTx';
import useUnlockWallet from 'hooks/useUnlockWallet';
import useWalletCallRequests from 'hooks/useWalletCallRequests';
import useWalletConnectRejectRequest from 'hooks/useWalletConnectRejectRequest';
import AccountSource from 'sources/AccountSource';
import { AccountScreensStackParams } from 'types/navigation';
import { CallRequestType, ParsedCallRequest } from 'types/walletConnect';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import useStyles from './useStyles';

export type Props = StackScreenProps<AccountScreensStackParams, 'WalletConnectCallRequest'>;

const WalletConnectCallRequest: React.FC<Props> = (props) => {
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

  const aminoTypes = useMemo(() => new AminoTypes(createDesmosTypes('desmos')), []);
  const messages: EncodeObject[] = useMemo(() => {
      if (request?.type === CallRequestType.SignDirect) {
        return request.signDoc.body.messages;
      }
      if (request?.type === CallRequestType.SignAmino) {
        return request.signDoc.msgs.map((msg) => aminoTypes.fromAmino(msg));
      }
      return [];
    }, [aminoTypes, request]);

  const onReject = useCallback(() => {
    if (request) {
      rejectRequest(request.sessionId, request.requestId, 'Rejected from the user');
    }
  }, [request, rejectRequest]);

  const onApprove = useCallback(async () => {
    if (
      request !== null &&
      (request.type === CallRequestType.SignAmino || request.type === CallRequestType.SignDirect)
    ) {
      const account = await AccountSource.getAccount(request?.signerAddress);
      let closeModal: undefined | (() => void);

      if (account !== null) {
        try {
          const wallet = await unlockWallet(account);
          if (wallet !== null) {
            setSigning(true);
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
    [navigation, request],
  );

  return request !== null ? (
    <StyledSafeAreaView
      topBar={<TopBar stackProps={props} title={t('tx details')} />}
      divider
      padding={0}
    >
      <TransactionDetails style={styles.txDetails} messages={messages} fee={stdFee} memo={memo} />
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

export default WalletConnectCallRequest;
