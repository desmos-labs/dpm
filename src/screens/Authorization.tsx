import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import {
  AvatarImage,
  Button,
  DAppSession as DAppSessionComponent,
  DpmImage,
  ListItemSeparator,
  StyledSafeAreaView,
  TopBar,
  Typography,
} from '../components';
import { useDrawerContext } from '../contexts/AppDrawerContex';
import useAuthorizeOperation from '../hooks/useAuthorizeOperation';
import useProfiles from '../hooks/useProfiles';
import useSelectedAccount from '../hooks/useSelectedAccount';
import useShowModal from '../hooks/useShowModal';
import useWalletConnectSessions from '../hooks/useWalletConnectSessions';
import useWalletConnectTerminate from '../hooks/useWalletConnectTerminate';
import { SingleButtonModal } from '../modals/SingleButtonModal';
import { TwoButtonModal } from '../modals/TwoButtonModal';
import { makeStyle } from '../theming';
import { DAppPermissions, DAppSession } from '../types/dapp';
import { AccountScreensStackParams, HomeScreensBottomTabsParams } from '../types/navigation';

export type Props = CompositeScreenProps<
  BottomTabScreenProps<HomeScreensBottomTabsParams, 'Authorization'>,
  StackScreenProps<AccountScreensStackParams>
>;

export const Authorization: React.FC<Props> = (props) => {
  const { navigation } = props;
  const { openDrawer } = useDrawerContext();
  const { t } = useTranslation();
  const styles = useStyles();
  const currentAccount = useSelectedAccount();
  const profiles = useProfiles();
  const sessions = useWalletConnectSessions(currentAccount);
  const showModal = useShowModal();
  const [revokeStatus, walletConnectTerminate] = useWalletConnectTerminate();
  const authorizeOperation = useAuthorizeOperation();

  const openProfileDetails = useCallback(() => {
    navigation.navigate({
      name: 'Profile',
      params: undefined,
    });
  }, [navigation]);

  const profilePicture = useMemo(() => {
    const userProfile = profiles[currentAccount.address];
    return userProfile?.profilePicture
      ? {
          uri: userProfile.profilePicture,
        }
      : require('../assets/default-profile-picture.png');
  }, [currentAccount, profiles]);

  let dAppSessions: DAppSession[] = useMemo(() => {
    dAppSessions = [];
    sessions.forEach((session) => {
      let iconUri: string | undefined;
      if (session.peerMeta?.icons !== undefined && session.peerMeta?.icons.length > 0) {
        iconUri = session.peerMeta?.icons[0];
      }
      dAppSessions.push({
        id: session.id,
        name: session.peerMeta?.name ?? 'Undefined name',
        creationDate: session.creationDate,
        // Wallet connect use this permissions.
        permissions: [DAppPermissions.RequestTxSign, DAppPermissions.BroadcastSignedTx],
        iconUri,
      });
    });
    return dAppSessions;
  }, [sessions]);

  const revokeAuthorization = useCallback(
    async (dAppSession: DAppSession) => {
      const authorized = await authorizeOperation(currentAccount);
      if (authorized) {
        walletConnectTerminate(dAppSession.id);
      }
    },
    [currentAccount, walletConnectTerminate, authorizeOperation]
  );

  const openRevokePopup = useCallback(
    (dAppSession: DAppSession) => {
      showModal(TwoButtonModal, {
        title: t('revoke'),
        message: t('remove dapp confirmation', { dapp: dAppSession.name }),
        positiveActionLabel: t('yes'),
        positiveAction: () => revokeAuthorization(dAppSession),
        negativeActionLabel: t('cancel'),
      });
    },
    [showModal, t, revokeAuthorization]
  );

  const navigateToAuthorize = useCallback(() => {
    navigation.navigate({
      name: 'ScanQr',
      params: undefined,
    });
  }, [navigation]);

  useEffect(() => {
    if (revokeStatus.error) {
      showModal(SingleButtonModal, {
        image: 'fail',
        title: t('error'),
        message: revokeStatus.error,
        actionLabel: t('ok'),
      });
    }
  }, [revokeStatus, showModal, t]);

  return (
    <StyledSafeAreaView
      style={styles.background}
      noIosPadding
      topBar={
        <TopBar
          style={styles.background}
          stackProps={{
            ...props,
            navigation: {
              ...navigation,
              openDrawer,
            },
          }}
          title={t('authorization')}
          rightElement={
            <AvatarImage
              style={styles.avatarImage}
              size={30}
              source={profilePicture}
              onPress={openProfileDetails}
            />
          }
        />
      }
    >
      {dAppSessions.length > 0 ? (
        <View style={styles.dAppSessions} onStartShouldSetResponder={() => true}>
          <FlatList
            data={dAppSessions}
            renderItem={({ item }) => (
              <DAppSessionComponent session={item} onRevoke={openRevokePopup} />
            )}
            keyExtractor={(item) => item.id}
            ItemSeparatorComponent={ListItemSeparator}
          />
        </View>
      ) : (
        <View style={styles.noDAppContainer}>
          <DpmImage style={styles.noDAppImage} source="no-connection" resizeMode="contain" />
          <Typography.Body1 style={styles.noDAppText}>
            {t('no authorization present')}
          </Typography.Body1>
          <Button mode="outlined" style={styles.authorizeButton} onPress={navigateToAuthorize}>
            {t('authorize')}
          </Button>
        </View>
      )}
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  background: {
    backgroundColor: theme.colors.background2,
  },
  avatarImage: {
    right: 16,
  },
  dAppSessions: {
    flex: 1,
  },
  noDAppContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
  },
  noDAppImage: {
    width: 150,
  },
  noDAppText: {
    textAlign: 'center',
  },
  authorizeButton: {
    marginTop: theme.spacing.l,
  },
}));
