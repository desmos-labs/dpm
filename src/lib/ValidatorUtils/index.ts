import { Validator } from 'types/validator';
import { defaultProfilePicture } from 'assets/images';

export function getValidatorAvatar(validator: Validator) {
  return validator.avatarUrl
    ? {
        uri: validator.avatarUrl,
      }
    : defaultProfilePicture;
}
