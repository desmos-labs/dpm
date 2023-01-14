import { StdFee } from '@cosmjs/amino';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import { EncodeObject } from '@cosmjs/proto-signing';
import TransactionDetails from 'components/TransactionDetails';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { useAllWalletConnectSessionsRequests } from '@recoil/walletConnectRequests';
import {
  WalletConnectRequest as Request,
  WalletConnectSignAminoRequest,
  WalletConnectSignDirectRequest,
} from 'types/walletConnect';
import {
  CosmosRPCMethods,
  encodeAminoSignRpcResponse,
  encodeDirectSignRpcResponse,
} from '@desmoslabs/desmjs-walletconnect-v2';
import useWalletConnectRequestRespond from 'hooks/walletconnect/useWalletConnectRequestRespond';
import useWalletConnectRequestReject from 'hooks/walletconnect/useWalletConnectRequestReject';
import { getSdkError } from '@walletconnect/utils';
import { useUnlockWallet } from 'hooks/useUnlockWallet';
import { SigningMode } from '@desmoslabs/desmjs';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import useStyles from './useStyles';

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.WALLET_CONNECT_REQUEST>;

const WalletConnectRequest: React.FC<NavProps> = (props) => {
  const { navigation } = props;
  const { t } = useTranslation();
  const styles = useStyles();
  const [signing, setSigning] = useState(false);
  const requests = useAllWalletConnectSessionsRequests();
  const unlockWallet = useUnlockWallet();
  const walletConnectResponse = useWalletConnectRequestRespond();
  const walletConnectReject = useWalletConnectRequestReject();
  const showModal = useShowModal();

  const request: Request | undefined = useMemo(() => {
    if (requests.length > 0) {
      return requests[0];
    }
    return undefined;
  }, [requests]);

  useEffect(() => {
    if (request === undefined) {
      navigation.goBack();
    }
  }, [request, navigation]);

  const showErrorModal = useCallback(
    (errorMsg: string) => {
      showModal(SingleButtonModal, {
        title: t('error'),
        message: errorMsg,
        actionLabel: t('ok'),
      });
    },
    [showModal, t],
  );

  const stdFee: StdFee | undefined = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return (request as WalletConnectSignAminoRequest).fee;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return (request as WalletConnectSignDirectRequest).fee;
    }
    return undefined;
  }, [request]);

  const memo = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return (request as WalletConnectSignAminoRequest).memo;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return (request as WalletConnectSignDirectRequest).memo;
    }
    return undefined;
  }, [request]);

  const messages: EncodeObject[] = useMemo(() => {
    if (request?.method === CosmosRPCMethods.SignAmino) {
      return (request as WalletConnectSignAminoRequest).msgs;
    }
    if (request?.method === CosmosRPCMethods.SignDirect) {
      return (request as WalletConnectSignDirectRequest).msgs;
    }
    return [];
  }, [request]);

  const onReject = useCallback(async () => {
    if (request !== undefined) {
      try {
        await walletConnectReject(request, getSdkError('USER_REJECTED'));
      } catch (e) {
        showErrorModal(e.message);
      }
    }
  }, [request, showErrorModal, walletConnectReject]);

  const onApprove = useCallback(async () => {
    if (request !== undefined) {
      const signingMode =
        request.method === CosmosRPCMethods.SignAmino ? SigningMode.AMINO : SigningMode.DIRECT;

      const wallet = await unlockWallet(request.accountAddress, signingMode);
      if (wallet === undefined) {
        return;
      }

      try {
        setSigning(true);
        if (request.method === CosmosRPCMethods.SignAmino) {
          const signResponse = await wallet.signer.signAmino(
            request.accountAddress,
            request.signDoc,
          );
          await walletConnectResponse(request, encodeAminoSignRpcResponse(signResponse));
        } else if (request.method === CosmosRPCMethods.SignDirect) {
          const signResponse = await wallet.signer.signDirect(
            request.accountAddress,
            request.signDoc,
          );
          await walletConnectResponse(request, encodeDirectSignRpcResponse(signResponse));
        } else {
          showErrorModal(`Unsupported method ${request.method}`);
        }
      } catch (e) {
        showErrorModal(e.message);
      } finally {
        setSigning(false);
      }
    }
  }, [request, showErrorModal, unlockWallet, walletConnectResponse]);

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

export default WalletConnectRequest;
