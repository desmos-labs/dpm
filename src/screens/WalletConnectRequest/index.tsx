import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import TransactionDetails from 'components/TransactionDetails';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import {
  CosmosRPCMethods,
  encodeAminoSignRpcResponse,
  encodeDirectSignRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';
import useWalletConnectRequestRespond from 'hooks/walletconnect/useWalletConnectRequestRespond';
import useWalletConnectRequestReject from 'hooks/walletconnect/useWalletConnectRequestReject';
import { getSdkError } from '@walletconnect/utils';
import useUnlockWallet from 'hooks/useUnlockWallet';
import { SigningMode } from '@desmoslabs/desmjs';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import { useRemoveWalletConnectSessionRequest } from '@recoil/walletConnectRequests';
import { PromiseTimeout } from 'lib/PromiseUtils';
import { useRejectAllRequests, useRequestFields } from './useHooks';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.WALLET_CONNECT_REQUEST>;

const WalletConnectRequest: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();
  const [signing, setSigning] = useState(false);
  const unlockWallet = useUnlockWallet();
  const walletConnectResponse = useWalletConnectRequestRespond();
  const walletConnectReject = useWalletConnectRequestReject();
  const showModal = useShowModal();
  const { request, memo, stdFee, messages } = useRequestFields();
  const rejectAllRequest = useRejectAllRequests();
  const removeRequest = useRemoveWalletConnectSessionRequest();

  useEffect(
    () =>
      navigation.addListener('beforeRemove', (e) => {
        if (e.data.action.type === 'GO_BACK') {
          rejectAllRequest();
        }
      }),
    [navigation, rejectAllRequest],
  );

  useEffect(() => {
    // Close the screen when we have processed all the requests.
    if (request === undefined) {
      navigation.pop();
    }
  }, [request, navigation]);

  const showErrorModal = useCallback(
    (errorMsg: string, action?: () => void) => {
      showModal(SingleButtonModal, {
        title: t('error'),
        message: errorMsg,
        actionLabel: t('ok'),
        action,
      });
    },
    [showModal, t],
  );

  const onReject = useCallback(async () => {
    if (request !== undefined) {
      const rejectResult = await walletConnectReject(request, getSdkError('USER_REJECTED'));
      if (rejectResult.isErr()) {
        showErrorModal(rejectResult.error.message, () => {
          removeRequest(request);
        });
      }
    }
  }, [removeRequest, request, showErrorModal, walletConnectReject]);

  const onApprove = useCallback(async () => {
    if (request !== undefined) {
      const signingMode =
        request.method === CosmosRPCMethods.SignAmino ? SigningMode.AMINO : SigningMode.DIRECT;

      const wallet = await unlockWallet(request.accountAddress, signingMode);
      if (wallet === undefined) {
        return;
      }

      setSigning(true);
      if (request.method === CosmosRPCMethods.SignAmino) {
        const signResponse = await wallet.signer.signAmino(request.accountAddress, request.signDoc);
        const responseResult = await walletConnectResponse(
          request,
          encodeAminoSignRpcResponse(signResponse),
        );
        if (responseResult.isErr()) {
          showErrorModal(responseResult.error.message);
        }
      } else if (request.method === CosmosRPCMethods.SignDirect) {
        const signResponse = await wallet.signer.signDirect(
          request.accountAddress,
          request.signDoc,
        );
        const responseResult = await PromiseTimeout.wrap(
          walletConnectResponse(request, encodeDirectSignRpcResponse(signResponse)),
          10000,
        );
        if (responseResult.isCompleted()) {
          const result = responseResult.resultData;

          if (result.isErr()) {
            showErrorModal(result.error.message);
          }
        } else {
          showErrorModal(t('request timeout'));
        }
      } else {
        showErrorModal(`Unsupported method ${request.method}`);
      }
      setSigning(false);
    }
  }, [request, showErrorModal, t, unlockWallet, walletConnectResponse]);

  return request !== null ? (
    <StyledSafeAreaView topBar={<TopBar stackProps={props} title={t('common:tx details')} />}>
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

export default WalletConnectRequest;
