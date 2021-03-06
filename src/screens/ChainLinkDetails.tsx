import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import { Button, StyledSafeAreaView, IconButton } from '../components';
import useDisconnectChainLink from '../hooks/useDisconnectChainLink';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import useRemoveChainLink from '../hooks/useRemoveChainLink';
import useSelectedAccount from '../hooks/useSelectedAccount';
import useShowModal from '../hooks/useShowModal';
import useUnlockWallet from '../hooks/useUnlockWallet';
import { SingleButtonModal } from '../modals/SingleButtonModal';
import { TwoButtonModal } from '../modals/TwoButtonModal';
import { makeStyle } from '../theming';
import { AccountScreensStackParams } from '../types/navigation';
import findLinkableChainInfoByName from '../utilils/find';
import { Typography } from '../components/typography';

export type Props = StackScreenProps<AccountScreensStackParams, 'ChainLinkDetails'>;

export const ChainLinkDetails: React.FC<Props> = (props) => {
  const { route, navigation } = props;
  const styles = useStyle();
  const { chainLink } = route.params;
  const { t } = useTranslation();
  const showModal = useShowModal();
  const [disconnectChain, setDisconnectChain] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const unlockWallet = useUnlockWallet();
  const disconnectChainLink = useDisconnectChainLink();
  const goToProfile = useNavigateToHomeScreen();
  const account = useSelectedAccount();
  const removeChainLink = useRemoveChainLink(account.address);

  const { chainIcon, chainName } = useMemo(() => {
    const chainInfo = findLinkableChainInfoByName(chainLink.chainName);
    return {
      chainIcon: chainInfo?.icon ?? require('../assets/chains/cosmos.png'),
      chainName: chainInfo?.name ?? chainLink.chainName,
    };
  }, [chainLink.chainName]);

  const showSuccessModal = useCallback(() => {
    showModal(SingleButtonModal, {
      image: 'success',
      title: t('success'),
      message: t('chain account was disconnected', {
        chain: chainName,
      }),
      actionLabel: t('go to profile'),
      action: () => {
        goToProfile({
          reset: true,
        });
      },
    });
  }, [goToProfile, showModal, t, chainName]);

  const showErrorModal = useCallback(
    (error) => {
      showModal(SingleButtonModal, {
        image: 'fail',
        title: t('error'),
        message: error.toString(),
        actionLabel: t('cancel'),
      });
    },
    [showModal, t]
  );

  useEffect(() => {
    if (disconnectChain) {
      setDisconnectChain(false);
      (async () => {
        setDisconnecting(true);
        try {
          const wallet = await unlockWallet(account);
          if (wallet !== null) {
            await disconnectChainLink(wallet, chainLink);
            removeChainLink({
              chainName: chainLink.chainName,
              externalAddress: chainLink.externalAddress,
            });
            showSuccessModal();
          }
        } catch (ex) {
          showErrorModal(ex);
        }
        setDisconnecting(false);
      })();
    }
  }, [
    account,
    chainLink,
    disconnectChain,
    disconnectChainLink,
    removeChainLink,
    showErrorModal,
    showSuccessModal,
    unlockWallet,
  ]);

  const disconnect = useCallback(() => {
    showModal(TwoButtonModal, {
      title: t('disconnect'),
      message: t('disconnect chain account confirmation', {
        chain: chainName,
      }),
      positiveActionLabel: t('yes'),
      positiveAction: () => {
        setDisconnectChain(true);
      },
      negativeActionLabel: t('cancel'),
    });
  }, [showModal, t, chainName]);

  const close = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <StyledSafeAreaView style={styles.root}>
      <View style={styles.details}>
        <IconButton style={styles.closeButton} icon="close" onPress={close} />
        <Image style={styles.chainIcon} source={chainIcon} />
        <Typography.Subtitle>{chainName}</Typography.Subtitle>
        <Typography.Body>
          {t('connected on')} {format(chainLink.creationTime, 'EEE MMM dd, yyyy')}
        </Typography.Body>
        <Button
          style={styles.disconnectButton}
          mode="outlined"
          onPress={disconnect}
          loading={disconnecting}
          disabled={disconnecting}
        >
          {t('disconnect')}
        </Button>
      </View>
    </StyledSafeAreaView>
  );
};

const useStyle = makeStyle((theme) => ({
  root: {
    backgroundColor: theme.colors.popupBackground,
    justifyContent: 'flex-end',
    padding: 0,
  },
  closeButton: {
    position: 'absolute',
    top: theme.spacing.s,
    right: theme.spacing.s,
    zIndex: 1,
  },
  details: {
    backgroundColor: theme.colors.background,
    paddingVertical: 60,
    alignItems: 'center',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  chainIcon: {
    width: 44,
    height: 44,
  },
  disconnectButton: {
    marginTop: theme.spacing.m,
  },
}));
