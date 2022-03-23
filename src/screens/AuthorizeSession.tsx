import React, { useCallback, useEffect, useMemo } from 'react';
import { FlatList, Image, ListRenderItemInfo, StyleProp, View, ViewStyle } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { format } from 'date-fns';
import { AccountScreensStackParams } from '../types/navigation';
import useWalletConnectRequestApproveTs from '../hooks/useWalletConnectSessionApprove';
import useWalletConnectSessionReject from '../hooks/useWalletConnectSessionReject';
import useSelectedAccount from '../hooks/useSelectedAccount';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import useAuthorizeOperation from '../hooks/useAuthorizeOperation';
import useShowModal from '../hooks/useShowModal';
import { Button, Divider, StyledSafeAreaView, TopBar, Typography } from '../components';
import { makeStyle } from '../theming';
import { SingleButtonModal } from '../modals/SingleButtonModal';

type Authorization = {
  title: string;
  limit?: string;
  expiration?: Date;
};

type Props = StackScreenProps<AccountScreensStackParams, 'AuthorizeSession'>;

export default function AuthorizeSession(props: Props) {
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
    [sessionRequestDetails]
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
      return require('../assets/desmos-icon-orange.png');
    }
    return require('../assets/desmos-icon-orange.png');
  }, [sessionRequestDetails]);

  const onDeny = useCallback(() => {
    reject(sessionRequestDetails.sessionId);
  }, [reject, sessionRequestDetails]);

  const onGrant = useCallback(async () => {
    const authorized = await authorizeOperation(selectedAccount);
    if (authorized) {
      approve(sessionRequestDetails.sessionId, [selectedAccount.address], currentChain.chainId);
    }
  }, [
    approve,
    currentChain.chainId,
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
    [t]
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
    [openModal, t]
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
    [authorizations.length, styles.borderBot, styles.borderTop, styles.permissionItem]
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
}

const useStyles = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.background2,
  },
  topBar: {
    backgroundColor: theme.colors.background2,
  },
  dappDetails: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    flexGrow: 10,
    flexBasis: 0,
  },
  dappIcon: {
    width: 60,
    height: 60,
  },
  permissionMessage: {
    marginTop: theme.spacing.m,
    textAlign: 'center',
  },
  permissionList: {
    marginTop: theme.spacing.m,
    alignSelf: 'flex-start',
    width: '100%',
  },
  borderTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  borderBot: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  permissionItem: {
    backgroundColor: theme.colors.background,
    padding: theme.spacing.s,
  },
  bottomMessage: {
    textAlign: 'center',
    marginTop: theme.spacing.m,
    flexGrow: 1,
  },
  denyButton: {
    marginTop: theme.spacing.s,
  },
}));

type AuthorizationListElementProps = {
  authorization: Authorization;
  style: StyleProp<ViewStyle>;
};

const AuthorizationListElement: React.FC<AuthorizationListElementProps> = (props) => {
  const { t } = useTranslation();
  const { authorization, style } = props;

  const expiration = authorization.expiration
    ? format(authorization.expiration, 'EEE MMM dd, yyyy')
    : t('never');

  return (
    <View style={style}>
      <Typography.Subtitle>{authorization.title}</Typography.Subtitle>

      {authorization.limit && (
        <Typography.Body>
          {t('limit')}: {authorization.limit}
        </Typography.Body>
      )}
      <Typography.Body>
        {t('expires on')}: {expiration}
      </Typography.Body>
    </View>
  );
};
