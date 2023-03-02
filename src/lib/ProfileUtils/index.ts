import { defaultProfilePicture } from 'assets/images';
import { DesmosProfile } from 'types/desmos';

/**
 * Returns the name that should be displayed in order to identify the given Desmos profile.
 * @param profile {DesmosProfile} which names should be returned.
 * @return A combination of profile nickname and DTag that can be used inside lists of profiles.
 */
export const getProfileDisplayName = (profile: DesmosProfile): string | undefined => {
  switch (true) {
    case profile.nickname !== undefined && profile.nickname !== '':
      return `${profile.nickname} (@${profile.dtag})`;
    case profile.dtag !== undefined:
      return `@${profile.dtag}`;
    default:
      return undefined;
  }
};

/**
 * Returns the profile picture associated to the provided Desmos profile.
 * @param profile {DesmosProfile} which profile picture should be returned.
 */
export const getProfilePicture = (profile: DesmosProfile | undefined) =>
  profile?.profilePicture ? { uri: profile?.profilePicture } : defaultProfilePicture;
