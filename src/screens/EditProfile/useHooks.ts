import React, { useState } from 'react';
import { DesmosProfile, ProfileParams } from 'types/desmos';
import { useTranslation } from 'react-i18next';
import useBroadcastTx, { BroadcastTxOptions } from 'hooks/useBroadcastTx';
import useUploadPicture from 'hooks/useUploadPicture';
import { Profiles } from '@desmoslabs/desmjs';
import { useActiveAccount } from '@recoil/activeAccount';
import { useStoreProfile } from '@recoil/profiles';

export const useValidationHooks = (params: ProfileParams | undefined) => {
  const { t } = useTranslation('profile');

  const validateDTag = React.useCallback(
    (dTag: string): string | undefined => {
      if (!params) return undefined;

      const regEx = new RegExp(params.dTag.regEx);
      switch (true) {
        case dTag.length < params.dTag.minLength:
          return t('dtag too short');
        case dTag.length > params.dTag.maxLength:
          return t('dtag too long');
        case !dTag.match(regEx):
          return t('invalid dtag');
        default:
          return undefined;
      }
    },
    [params, t],
  );

  const validateNickname = React.useCallback(
    (nickname: string): string | undefined => {
      if (!params) return undefined;

      switch (true) {
        case nickname.length < params.nickname.minLength:
          return t('nickname too short');
        case nickname.length > params.nickname.maxLength:
          return t('nickname too long');
        default:
          return undefined;
      }
    },
    [params, t],
  );

  const validateBiography = React.useCallback(
    (bio: string): string | undefined => {
      if (!params) return undefined;

      switch (true) {
        case bio.length > params.bio.maxLength:
          return t('bio too long');
        default:
          return undefined;
      }
    },
    [params, t],
  );

  return {
    validateDTag,
    validateNickname,
    validateBiography,
  };
};

/**
 * Represents the value to be used for each field inside MsgSaveProfile when its value should not be modified.
 */
const DoNotModify = '[do-not-modify]';

/**
 * Wraps the useUploadPicture hook in order to returns only the uploaded picture URL.
 */
const useUploadPicToIPS = () => {
  const uploadPicture = useUploadPicture();
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>();

  const uploadPic = React.useCallback(
    async (imageURI: string) => {
      setUploading(true);
      setUploadError(undefined);
      try {
        const { url } = await uploadPicture(imageURI);
        setUploading(false);
        return url;
      } catch (e: any) {
        setUploadError(e?.message);
        setUploading(false);
        throw e;
      }
    },
    [uploadPicture],
  );

  return { uploadPic, uploading, uploadError };
};

/**
 * Compares the given original and updated value, returning what should be used in order to broadcast the transaction.
 * If {@param original} and {@param updated} are equals, returns DoNotModify.
 * If the values are different:
 * - if {@param updated} is undefined, returns DoNotModify
 * - if {@param updated} is not undefined, returns the updated value
 * @param original
 * @param updated
 */
const compareValue = (original: string | undefined, updated: string | undefined): string => {
  if (original === updated) return DoNotModify;
  return updated === undefined ? DoNotModify : updated;
};

export interface SaveProfileParams {
  readonly dTag: string | undefined;
  readonly nickname: string | undefined;
  readonly biography: string | undefined;
  readonly profilePic: string | undefined;
  readonly coverPic: string | undefined;
}

export const useSaveProfile = (options?: BroadcastTxOptions) => {
  const {
    uploadPic: uploadCoverPic,
    uploading: coverPicUploading,
    uploadError: coverPicUploadError,
  } = useUploadPicToIPS();
  const {
    uploadPic: uploadProfilePic,
    uploading: profilePicUploading,
    uploadError: profilePicUploadError,
  } = useUploadPicToIPS();
  const activeAccount = useActiveAccount()!;
  const broadcastTx = useBroadcastTx();
  const [preparing, setPreparing] = useState<boolean>(false);
  const storeProfile = useStoreProfile();

  const saveProfile = React.useCallback(
    async (profile: DesmosProfile | undefined, params: SaveProfileParams) => {
      setPreparing(true);
      try {
        const coverPicUrl = params.coverPic ? await uploadCoverPic(params.coverPic) : DoNotModify;
        const profilePicUrl = params.profilePic
          ? await uploadProfilePic(params.profilePic)
          : DoNotModify;

        const broadcastOptions: BroadcastTxOptions = {
          ...options,
          onSuccess: () => {
            // On success update the cached profile.
            storeProfile(activeAccount.address, {
              address: activeAccount.address,
              dtag: params.dTag ?? profile?.dtag,
              nickname: params.nickname ?? profile?.nickname,
              bio: params.biography ?? profile?.bio,
              profilePicture: params.profilePic ? profilePicUrl : profile?.profilePicture,
              coverPicture: params.coverPic ? coverPicUrl : profile?.coverPicture,
            });
            if (options?.onSuccess) {
              options.onSuccess();
            }
          },
        };

        const message: Profiles.v3.MsgSaveProfileEncodeObject = {
          typeUrl: Profiles.v3.MsgSaveProfileTypeUrl,
          value: {
            dtag: compareValue(profile?.dtag, params.dTag),
            nickname: compareValue(profile?.nickname, params.nickname),
            bio: compareValue(profile?.bio, params.biography),
            coverPicture: coverPicUrl,
            profilePicture: profilePicUrl,
            creator: activeAccount.address,
          },
        };
        setPreparing(false);

        broadcastTx([message], broadcastOptions);
      } catch (e) {
        setPreparing(false);
        throw e;
      }
    },
    [uploadCoverPic, uploadProfilePic, options, activeAccount.address, broadcastTx, storeProfile],
  );

  return {
    saveProfile,
    preparing,
    coverPicUploading,
    coverPicUploadError,
    profilePicUploading,
    profilePicUploadError,
  };
};
