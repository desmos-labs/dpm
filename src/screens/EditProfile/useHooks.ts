import React, { useState } from 'react';
import { DesmosProfile, ProfileParams } from 'types/desmos';
import { useTranslation } from 'react-i18next';
import useBroadcastTx, { BroadcastTxOptions } from 'hooks/useBroadcastTx';
import useUploadPicture from 'hooks/useUploadPicture';
import { MsgSaveProfileEncodeObject, MsgSaveProfileTypeUrl } from '@desmoslabs/desmjs';
import { useActiveAccount } from '@recoil/activeAccount';

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
  return React.useCallback(
    async (imageURI: string) => {
      const { url } = await uploadPicture(imageURI);
      return url;
    },
    [uploadPicture],
  );
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
  const uploadPicture = useUploadPicToIPS();
  const activeAccount = useActiveAccount()!;
  const broadcastTx = useBroadcastTx();
  const [preparing, setPreparing] = useState<boolean>(false);

  const saveProfile = React.useCallback(
    async (profile: DesmosProfile | undefined, params: SaveProfileParams) => {
      setPreparing(true);
      const coverPicUrl = params.coverPic ? await uploadPicture(params.coverPic) : DoNotModify;
      const profilePicUrl = params.profilePic
        ? await uploadPicture(params.profilePic)
        : DoNotModify;

      const message: MsgSaveProfileEncodeObject = {
        typeUrl: MsgSaveProfileTypeUrl,
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

      await broadcastTx([message], options);
    },
    [uploadPicture, activeAccount, broadcastTx, options],
  );

  return {
    saveProfile,
    preparing,
  };
};
