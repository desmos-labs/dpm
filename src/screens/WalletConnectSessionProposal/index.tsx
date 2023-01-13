import { StackScreenProps } from '@react-navigation/stack';
import React, { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
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
import useStyles from './useStyles';

export interface WalletConnectSessionProposalParams {
  proposal: Proposal;
}

type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.WALLET_CONNECT_SESSION_PROPOSAL>;

const WalletConnectSessionProposal: FC<NavProps> = (props) => {
  const { route, navigation } = props;
  const { proposal } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const openModal = useShowModal();
  const approveSession = useWalletConnectApproveSessionProposal();
  const rejectSession = useWalletConnectRejectSessionProposal();
  const [authorizing, setAuthorizing] = useState(false);
  const [rejecting, setRejecting] = useState(false);

  const appName = useMemo(() => proposal.name, [proposal]);

  const dAppIcon = useMemo(() => walletConnectIconUriToImageSource(proposal.iconUri), [proposal]);

  const showSuccessModal = useCallback(() => {
    openModal(SingleButtonModal, {
      image: DPMImages.Success,
      title: t('success'),
      message: t('app authorized', { app: appName }),
      actionLabel: t('go to authorization'),
      action: () =>
        navigation.reset({
          index: 0,
          routes: [{ name: ROUTES.HOME_TABS, params: { screen: ROUTES.WALLET_CONNECT_SESSIONS } }],
        }),
    });
  }, [appName, navigation, openModal, t]);

  const showErrorModal = useCallback(
    (errorMsg: string) => {
      openModal(SingleButtonModal, {
        title: t('error'),
        message: errorMsg,
        actionLabel: t('ok'),
      });
    },
    [openModal, t],
  );

  const onDeny = useCallback(async () => {
    try {
      setRejecting(true);
      await rejectSession(proposal);
      navigation.goBack();
    } catch (e) {
      showErrorModal(e.message);
    } finally {
      setRejecting(false);
    }
  }, [navigation, proposal, rejectSession, showErrorModal]);

  const onGrant = useCallback(async () => {
    try {
      setAuthorizing(true);
      await approveSession(proposal);
      showSuccessModal();
    } catch (e) {
      showErrorModal(e.message);
    } finally {
      setAuthorizing(false);
    }
  }, [approveSession, proposal, showErrorModal, showSuccessModal]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar style={styles.topBar} stackProps={props} title={t('authorization')} />}
    >
      <View style={styles.dappDetails}>
        <Image style={styles.dappIcon} source={dAppIcon} resizeMode="center" />
        <Typography.Body style={styles.permissionMessage}>
          {t('walletConnect:authorize app', {
            app: appName,
          })}
        </Typography.Body>
      </View>
      <Typography.Body style={styles.bottomMessage}>
        {t('note')}: {t('walletConnect:ability to revoke authorizations')}
      </Typography.Body>
      <Button
        mode="contained"
        onPress={onGrant}
        loading={authorizing}
        disabled={authorizing || rejecting}
      >
        {t('walletConnect:authorize')}
      </Button>
      <Button
        style={styles.denyButton}
        mode="contained"
        onPress={onDeny}
        accent
        loading={rejecting}
        disabled={authorizing || rejecting}
      >
        {t('walletConnect:deny')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default WalletConnectSessionProposal;
