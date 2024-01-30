import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View } from 'react-native';
import SingleButtonModal from 'modals/SingleButtonModal';
import useShowModal from 'hooks/useShowModal';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { WalletConnectSessionProposal as Proposal } from 'types/walletConnect';
import useWalletConnectApproveSessionProposal from 'hooks/walletconnect/useWalletConnectApproveSessionProposal';
import useWalletConnectRejectSessionProposal from 'hooks/walletconnect/useWalletConnectRejectSessionProposal';
import { DPMImages } from 'types/images';
import { walletConnectIconUriToImageSource } from 'lib/WalletConnectUtils';
import FastImage from 'react-native-fast-image';
import useResetToHomeScreen from 'hooks/navigation/useResetToHomeScreen';
import useStyles from './useStyles';

export interface WalletConnectSessionProposalParams {
  proposal: Proposal;
  /**
   * Tells if the application return to the app that has triggered the paring request
   * after the session is approved.
   */
  returnToApp?: boolean;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.WALLET_CONNECT_SESSION_PROPOSAL>;

const WalletConnectSessionProposal: FC<NavProps> = (props) => {
  const { route, navigation } = props;
  const { proposal, returnToApp } = route.params;
  const { t } = useTranslation('walletConnect');
  const styles = useStyles();
  const openModal = useShowModal();
  const approveSession = useWalletConnectApproveSessionProposal();
  const rejectSession = useWalletConnectRejectSessionProposal();
  const resetToHome = useResetToHomeScreen();
  const [authorizing, setAuthorizing] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const appName = useMemo(() => proposal.name, [proposal]);
  const dAppIcon = useMemo(() => walletConnectIconUriToImageSource(proposal.iconUri), [proposal]);

  const showSuccessModal = useCallback(() => {
    openModal(SingleButtonModal, {
      image: DPMImages.Success,
      title: t('common:success'),
      message: returnToApp
        ? t('app authorized, you can return to the app', { app: appName })
        : t('app authorized', { app: appName }),
      actionLabel: returnToApp ? t('common:ok') : t('go to authorization'),
      action: () => {
        if (returnToApp) {
          resetToHome();
        } else {
          navigation.reset({
            index: 0,
            routes: [
              { name: ROUTES.HOME_TABS, params: { screen: ROUTES.WALLET_CONNECT_SESSIONS } },
            ],
          });
        }
      },
    });
  }, [appName, navigation, openModal, resetToHome, returnToApp, t]);

  const showErrorModal = useCallback(
    (errorMsg: string) => {
      openModal(SingleButtonModal, {
        title: t('common:error'),
        message: errorMsg,
        actionLabel: t('common:ok'),
      });
    },
    [openModal, t],
  );

  const onDeny = useCallback(async () => {
    setRejecting(true);
    const rejectResult = await rejectSession(proposal);
    if (rejectResult.isOk()) {
      navigation.goBack();
    } else {
      showErrorModal(rejectResult.error.message);
    }
    setRejecting(false);
  }, [navigation, proposal, rejectSession, showErrorModal]);

  const onGrant = useCallback(async () => {
    setAuthorizing(true);
    const approveSessionResult = await approveSession(proposal);
    if (approveSessionResult.isOk()) {
      showSuccessModal();
    } else {
      showErrorModal(approveSessionResult.error.message);
    }
    setAuthorizing(false);
  }, [approveSession, proposal, showErrorModal, showSuccessModal]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar style={styles.topBar} stackProps={props} title={t('authorization')} />}
    >
      <View style={styles.dappDetails}>
        <FastImage style={styles.dappIcon} source={dAppIcon} resizeMode="center" />
        <Typography.Body style={styles.permissionMessage}>
          {t('authorize app', {
            app: appName,
          })}
        </Typography.Body>
      </View>
      <Typography.Body style={styles.bottomMessage}>
        {t('common:note')}: {t('ability to revoke authorizations')}
      </Typography.Body>
      <Button
        mode="contained"
        onPress={onGrant}
        loading={authorizing}
        disabled={authorizing || rejecting}
      >
        {t('authorize')}
      </Button>
      <Button
        style={styles.denyButton}
        mode="contained"
        onPress={onDeny}
        accent
        loading={rejecting}
        disabled={authorizing || rejecting}
      >
        {t('deny')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default WalletConnectSessionProposal;
