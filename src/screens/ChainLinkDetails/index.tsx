import { StackScreenProps } from '@react-navigation/stack';
import { format } from 'date-fns';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, View } from 'react-native';
import SingleButtonModal from 'modals/SingleButtonModal';
import TwoButtonModal from 'modals/TwoButtonModal';
import useDisconnectChainLink from 'hooks/useDisconnectChainLink';
import useNavigateToHomeScreen from 'hooks/useNavigateToHomeScreen';
import useRemoveChainLink from 'hooks/useRemoveChainLink';
import useSelectedAccount from 'hooks/useSelectedAccount';
import useShowModal from 'hooks/useShowModal';
import useUnlockWallet from 'hooks/useUnlockWallet';
import Typography from 'components/Typography';
import StyledSafeAreaView from 'components/StyledSafeAreaView';
import Button from 'components/Button';
import { RootNavigatorParamList } from 'navigation/RootNavigator';
import ROUTES from 'navigation/routes';
import { ChainLink } from 'types/chains';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getLinkableChainInfoByName } from 'lib/ChainsUtils';
import { cosmosIcon } from 'assets/images';
import TopBar from 'components/TopBar';
import Spacer from 'components/Spacer';
import { useIsCurrentUserLink } from 'screens/ChainLinkDetails/useHooks';
import useStyles from './useStyles';

export type NavProps = StackScreenProps<RootNavigatorParamList, ROUTES.CHAIN_LINK_DETAILS>;

export interface ChainLinkDetailsProps {
  chainLink: ChainLink;
}

const ChainLinkDetails = () => {
  const navigation = useNavigation<NavProps['navigation']>();
  const { params } = useRoute<NavProps['route']>();

  const styles = useStyles();
  const { chainLink } = params;
  const { t } = useTranslation();

  const isCurrentUserLink = useIsCurrentUserLink(chainLink);
  const { chainIcon, chainName } = useMemo(() => {
    const chainInfo = getLinkableChainInfoByName(chainLink.chainName);
    return {
      chainIcon: chainInfo?.icon ?? cosmosIcon,
      chainName: chainInfo?.name ?? chainLink.chainName,
    };
  }, [chainLink.chainName]);

  // const showModal = useShowModal();
  // const [disconnectChain, setDisconnectChain] = useState(false);
  // const [disconnecting, setDisconnecting] = useState(false);
  // const unlockWallet = useUnlockWallet();
  // const disconnectChainLink = useDisconnectChainLink();
  // const goToProfile = useNavigateToHomeScreen();
  // const account = useSelectedAccount();
  //
  // const removeChainLink = useRemoveChainLink(account.address);
  //

  //
  // const showSuccessModal = useCallback(() => {
  //   showModal(SingleButtonModal, {
  //     image: DPMImages.Success,
  //     title: t('success'),
  //     message: t('chain account was disconnected', {
  //       chain: chainName,
  //     }),
  //     actionLabel: t('go to profile'),
  //     action: () => {
  //       goToProfile({
  //         reset: true,
  //       });
  //     },
  //   });
  // }, [goToProfile, showModal, t, chainName]);
  //
  // const showErrorModal = useCallback(
  //   (error) => {
  //     showModal(SingleButtonModal, {
  //       image: DPMImages.Fail,
  //       title: t('error'),
  //       message: error.toString(),
  //       actionLabel: t('cancel'),
  //     });
  //   },
  //   [showModal, t],
  // );
  //
  // useEffect(() => {
  //   if (disconnectChain) {
  //     setDisconnectChain(false);
  //     (async () => {
  //       setDisconnecting(true);
  //       try {
  //         const wallet = await unlockWallet(account);
  //         if (wallet !== null) {
  //           await disconnectChainLink(wallet, chainLink);
  //           removeChainLink({
  //             chainName: chainLink.chainName,
  //             externalAddress: chainLink.externalAddress,
  //           });
  //           showSuccessModal();
  //         }
  //       } catch (ex) {
  //         showErrorModal(ex);
  //       }
  //       setDisconnecting(false);
  //     })();
  //   }
  // }, [
  //   account,
  //   chainLink,
  //   disconnectChain,
  //   disconnectChainLink,
  //   removeChainLink,
  //   showErrorModal,
  //   showSuccessModal,
  //   unlockWallet,
  // ]);
  //
  // const disconnect = useCallback(() => {
  //   showModal(TwoButtonModal, {
  //     title: t('disconnect'),
  //     message: t('disconnect chain account confirmation', {
  //       chain: chainName,
  //     }),
  //     positiveActionLabel: t('yes'),
  //     positiveAction: () => {
  //       setDisconnectChain(true);
  //     },
  //     negativeActionLabel: t('cancel'),
  //   });
  // }, [showModal, t, chainName]);
  //

  return (
    <StyledSafeAreaView style={styles.root}>
      <TopBar stackProps={{ navigation }} />

      {/* Chain data */}
      <View style={styles.chainDetails}>
        <Image style={styles.chainLinkIcon} source={chainIcon} />
        <Spacer paddingVertical={8} />
        <Typography.Title>{chainName}</Typography.Title>
      </View>

      <Spacer paddingVertical={8} />

      {/* Link data */}
      <View>
        <Typography.Body1 style={styles.linkDetailTitle}>{t('external address')}</Typography.Body1>
        <Typography.Body>{chainLink.externalAddress}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('plain text')}</Typography.Body1>
        <Typography.Body>{chainLink.proof.plainText}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('signature')}</Typography.Body1>
        <Typography.Body>{chainLink.proof.signature}</Typography.Body>

        <Spacer paddingVertical={8} />

        <Typography.Body1 style={styles.linkDetailTitle}>{t('connected on')}</Typography.Body1>
        <Typography.Body>{format(chainLink.creationTime, 'EEE MMM dd, yyyy')}</Typography.Body>
      </View>

      {/* Disconnect button */}
      {isCurrentUserLink && (
        <Button style={styles.disconnectButton} mode="outlined">
          {t('disconnect')}
        </Button>
      )}
    </StyledSafeAreaView>
  );
};

export default ChainLinkDetails;
