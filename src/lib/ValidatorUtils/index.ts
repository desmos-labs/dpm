import { Validator } from 'types/validator';
import { defaultProfilePicture } from 'assets/images';

/**
 * Returns the avatar picture associated to the provided validator.
 * @param validator {Validator} which avatar picture should be returned.
 */
export const getValidatorAvatar = (validator: Validator) => {
  if ((validator.profile?.profilePicture?.length ?? 0) > 0) {
    return { uri: validator.profile!.profilePicture };
  }
  return (validator.avatarUrl?.length ?? 0) > 0
    ? { uri: validator.avatarUrl }
    : defaultProfilePicture;
};

/**
 * Returns the name associated to the provided validator.
 * @param validator {Validator} which name should be returned.
 */
export const getValidatorName = (validator: Validator) =>
  validator.profile?.nickname ? validator.profile?.nickname : validator.moniker;

/**
 * Returns the biography associated to the provided validator.
 * @param validator {Validator} which biography should be returned.
 */
export const getValidatorBio = (validator: Validator) =>
  (validator.profile?.bio?.length ?? 0) > 0 ? validator.profile?.bio : validator.details;
