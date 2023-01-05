import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, ListRenderItemInfo, View } from 'react-native';
import SingleButtonModal from 'modals/SingleButtonModal';
import useCurrentChainInfo from 'hooks/desmosclient/useCurrentChainInfo';
import useAuthorizeOperation from 'hooks/useAuthorizeOperation';
import useNavigateToHomeScreen from 'hooks/useNavigateToHomeScreen';
import useSelectedAccount from 'hooks/useSelectedAccount';
import useShowModal from 'hooks/useShowModal';
import useWalletConnectRequestApproveTs from 'hooks/useWalletConnectSessionApprove';
import useWalletConnectSessionReject from 'hooks/useWalletConnectSessionReject';
import { AccountScreensStackParams } from 'types/navigation';
import Typography from 'components/Typography';
import { Authorization } from 'types/authorization';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import TopBar from 'components/TopBar';
import Divider from 'components/Divider';
import Button from 'components/Button';
import AuthorizationListElement from './components/AuthorizationListElement';
import useStyles from './useStyles';

type Props = StackScreenProps<AccountScreensStackParams, 'AuthorizeSession'>;

const AuthorizeSession = (props: Props) => {
  const { route } = props;
  const { sessionRequestDetails } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const [approveStatus, approve] = useWalletConnectRequestApproveTs();
  const [rejectStatus, reject] = useWalletConnectSessionReject();
  const selectedAccount = useSelectedAccount();
  const currentChain = useCurrentChainInfo();
  const navigateToHomeScreen = useNavigateToHomeScreen();
  const authorizeOperation = useAuthorizeOperation();
  const openModal = useShowModal();

  const appName = useMemo(
    () => sessionRequestDetails.peerMeta?.name ?? 'Unknown app',
    [sessionRequestDetails],
  );

  const dAppIcon = useMemo(() => {
    const icons = sessionRequestDetails.peerMeta?.icons;
    if (icons !== undefined && icons.length > 0) {
      const iconUri = icons[0];
      if (icons.indexOf('http') === 0) {
        return {
          uri: iconUri,
        };
      }
      return require('assets/images/desmosIcon-orange.png');
    }
    return require('assets/images/desmosIcon-orange.png');
  }, [sessionRequestDetails]);

  const onDeny = useCallback(() => {
    reject(sessionRequestDetails.sessionId);
  }, [reject, sessionRequestDetails]);

  const onGrant = useCallback(async () => {
    const authorized = await authorizeOperation(selectedAccount);
    if (authorized) {
      approve(
        sessionRequestDetails.sessionId,
        [selectedAccount.address],
        currentChain.chainLinkName,
      );
    }
  }, [
    approve,
    currentChain.chainLinkName,
    selectedAccount,
    sessionRequestDetails.sessionId,
    authorizeOperation,
  ]);

  const authorizations: Authorization[] = useMemo(
    () =>
      // NOTE: At the moment we support only wallet connect so the authorizations
      // are always this
      [
        {
          title: t('sign transactions'),
        },
        {
          title: t('broadcast signed transactions'),
        },
      ],
    [t],
  );

  const showSuccessModal = useCallback(() => {
    openModal(SingleButtonModal, {
      image: 'success',
      title: t('success'),
      message: t('app authorized', { app: appName }),
      actionLabel: t('go to authorization'),
      action: () =>
        navigateToHomeScreen({
          reset: true,
          tab: 'Authorization',
        }),
    });
  }, [t, navigateToHomeScreen, appName, openModal]);

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

  const renderListItem = useCallback(
    (info: ListRenderItemInfo<Authorization>) => {
      const { item, index } = info;
      const style: any[] = [styles.permissionItem];
      if (index === 0) {
        style.push(styles.borderTop);
      }
      if (index === authorizations.length - 1) {
        style.push(styles.borderBot);
      }
      return <AuthorizationListElement authorization={item} style={style} />;
    },
    [authorizations.length, styles.borderBot, styles.borderTop, styles.permissionItem],
  );

  useEffect(() => {
    if (approveStatus.error) {
      showErrorModal(approveStatus.error.toString());
    } else if (approveStatus.approved) {
      showSuccessModal();
    }
  }, [approveStatus, showSuccessModal, showErrorModal]);

  useEffect(() => {
    if (rejectStatus.error) {
      showErrorModal(rejectStatus.error.toString());
    } else if (rejectStatus.rejected) {
      navigateToHomeScreen({
        reset: true,
        tab: 'Authorization',
      });
    }
  }, [rejectStatus, navigateToHomeScreen, showErrorModal]);

  return (
    <StyledSafeAreaView
      style={styles.root}
      topBar={<TopBar style={styles.topBar} stackProps={props} title={t('authorization')} />}
    >
      <View style={styles.dappDetails}>
        <Image style={styles.dappIcon} source={dAppIcon} resizeMode="center" />
        <Typography.Body style={styles.permissionMessage}>
          {t('app requires authorizations', {
            app: appName,
          })}
          :
        </Typography.Body>
        <FlatList
          style={styles.permissionList}
          data={authorizations}
          renderItem={renderListItem}
          ItemSeparatorComponent={Divider}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <Typography.Body style={styles.bottomMessage}>
        {t('note')}: {t('ability to revoke authorizations')}
      </Typography.Body>
      <Button mode="contained" onPress={onGrant}>
        {t('grant')}
      </Button>
      <Button style={styles.denyButton} mode="contained" onPress={onDeny} accent>
        {t('deny')}
      </Button>
    </StyledSafeAreaView>
  );
};

export default AuthorizeSession;
