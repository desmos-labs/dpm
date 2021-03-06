import { convertCoin, DesmosProfile, MsgSaveProfileEncodeObject } from '@desmoslabs/sdk-core';
import { useCurrentChainInfo } from '@desmoslabs/sdk-react';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, View } from 'react-native';
import { Button, Divider, LabeledValue, StyledSafeAreaView, TopBar } from '../components';
import { ProfileHeader } from '../components/ProfileHeader';
import useBroadcastMessages from '../hooks/useBroadcastMessages';
import useNavigateToHomeScreen from '../hooks/useNavigateToHomeScreen';
import useSaveProfile from '../hooks/useSaveProfile';
import useShowModal from '../hooks/useShowModal';
import useUnlockWallet from '../hooks/useUnlockWallet';
import useUploadPicture from '../hooks/useUploadPicture';
import { SingleButtonModal } from '../modals/SingleButtonModal';
import { makeStyle } from '../theming';
import { computeTxFees, messagesGas } from '../types/fees';
import { AccountScreensStackParams, resetTo, RootStackParams } from '../types/navigation';

export type Props = CompositeScreenProps<
  StackScreenProps<AccountScreensStackParams, 'ConfirmProfileEdit'>,
  StackScreenProps<RootStackParams>
>;

export const ConfirmProfileEdit: React.FC<Props> = (props) => {
  const { route } = props;
  const {
    account,
    oldProfile,
    profile,
    localCoverPictureUri,
    localProfilePictureUri,
    feeGranter,
    goBackTo,
  } = route.params;
  const { t } = useTranslation();
  const styles = useStyles();
  const chainInfo = useCurrentChainInfo();
  const unlockWallet = useUnlockWallet();
  const [broadcastingTx, setBroadcastingTx] = useState(false);
  const saveProfile = useSaveProfile();
  const navigateToHomeScreen = useNavigateToHomeScreen();
  const showModal = useShowModal();
  const uploadPicture = useUploadPicture();
  const broadcastMessages = useBroadcastMessages();

  const txFee = useMemo(() => {
    const saveProfileMessage: MsgSaveProfileEncodeObject = {
      typeUrl: '/desmos.profiles.v1beta1.MsgSaveProfile',
      value: {
        creator: account.address,
        dtag: profile.dtag,
        nickname: profile.nickname,
        bio: profile.bio,
        profilePicture: profile.profilePicture,
        coverPicture: profile.coverPicture,
      },
    };
    const messages = [saveProfileMessage];
    const gas = messagesGas(messages);
    return computeTxFees(gas, chainInfo.coinDenom).average;
  }, [account.address, profile, chainInfo.coinDenom]);

  const convertedTxFee = useMemo(() => {
    const converted = convertCoin(txFee.amount[0], 6, chainInfo.denomUnits);
    return converted !== null ? converted : txFee.amount[0];
  }, [chainInfo.denomUnits, txFee.amount]);

  const onConfirm = useCallback(async () => {
    const { navigation } = props;
    setBroadcastingTx(true);
    try {
      const wallet = await unlockWallet(account);
      if (wallet !== null) {
        const newProfile: DesmosProfile = {
          ...profile,
        };

        if (newProfile.dtag === oldProfile.dtag) {
          newProfile.dtag = '[do-not-modify]';
        }

        if (localCoverPictureUri !== undefined) {
          const response = await uploadPicture(localCoverPictureUri);
          newProfile.coverPicture = response.url;
        } else if (newProfile.coverPicture?.length === 0) {
          newProfile.coverPicture = undefined;
        } else if (newProfile.coverPicture === oldProfile.coverPicture) {
          newProfile.coverPicture = '[do-not-modify]';
        }

        if (localProfilePictureUri !== undefined) {
          const response = await uploadPicture(localProfilePictureUri);
          newProfile.profilePicture = response.url;
        } else if (newProfile.profilePicture?.length === 0) {
          newProfile.profilePicture = undefined;
        } else if (newProfile.profilePicture === oldProfile.profilePicture) {
          newProfile.profilePicture = '[do-not-modify]';
        }

        if (newProfile.bio?.length === 0) {
          newProfile.bio = undefined;
        } else if (newProfile.bio === oldProfile.bio) {
          newProfile.bio = '[do-not-modify]';
        }

        if (newProfile.nickname?.length === 0) {
          newProfile.nickname = undefined;
        } else if (newProfile.nickname === oldProfile.nickname) {
          newProfile.nickname = '[do-not-modify]';
        }

        const saveProfileMessage: MsgSaveProfileEncodeObject = {
          typeUrl: '/desmos.profiles.v1beta1.MsgSaveProfile',
          value: {
            creator: account.address,
            ...newProfile,
          },
        };
        const messages = [saveProfileMessage];
        await broadcastMessages(wallet, messages, txFee, undefined, feeGranter);
        await saveProfile(profile);

        showModal(SingleButtonModal, {
          image: 'success',
          title: t('success'),
          message: t('profile saved'),
          actionLabel: goBackTo === undefined ? t('go to profile') : t('continue'),
          action:
            goBackTo === undefined
              ? () => navigateToHomeScreen({ reset: true })
              : () => navigation.dispatch(resetTo(goBackTo)),
        });
      }
    } catch (e) {
      showModal(SingleButtonModal, {
        image: 'fail',
        title: t('ops'),
        message: `${t('unexpected error occurred')}\n${e.toString()}`,
        actionLabel: t('close'),
        action: () => {
          navigation.goBack();
        },
      });
    }
    setBroadcastingTx(false);
  }, [
    unlockWallet,
    account,
    profile,
    localCoverPictureUri,
    oldProfile,
    localProfilePictureUri,
    broadcastMessages,
    txFee,
    feeGranter,
    saveProfile,
    showModal,
    t,
    goBackTo,
    uploadPicture,
    navigateToHomeScreen,
    props,
  ]);

  return (
    <StyledSafeAreaView padding={0} topBar={<TopBar stackProps={props} title={t('confirm')} />}>
      <ProfileHeader
        coverPictureUri={localCoverPictureUri ?? profile.coverPicture}
        profilePictureUri={localProfilePictureUri ?? profile.profilePicture}
      />
      <View style={styles.details} onStartShouldSetResponder={() => true}>
        <ScrollView>
          <LabeledValue label={t('nickname')} value={profile.nickname} />
          <Divider />

          <LabeledValue label={t('dtag')} value={profile.dtag} />
          <Divider />

          <LabeledValue label={t('bio')} value={profile.bio} />
          <Divider />

          <LabeledValue label={t('address')} value={account.address} />
          <Divider />

          <LabeledValue label={t('tx type')} value={t('tx type save profile')} />
          <Divider />

          <LabeledValue
            label={t('fee')}
            value={`${convertedTxFee.amount} ${convertedTxFee.denom.toUpperCase()}`}
          />
          <Divider />
        </ScrollView>
      </View>

      <Button
        style={styles.confirmBtn}
        mode="contained"
        onPress={onConfirm}
        loading={broadcastingTx}
        disabled={broadcastingTx}
      >
        {!broadcastingTx ? t('confirm') : t('broadcasting tx')}
      </Button>
    </StyledSafeAreaView>
  );
};

const useStyles = makeStyle((theme) => ({
  details: {
    flex: 1,
  },
  confirmBtn: {
    margin: theme.spacing.m,
  },
}));
