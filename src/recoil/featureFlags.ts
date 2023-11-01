import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { convertPostHogFeatureFlags } from 'lib/FeatureFlagsUtils';
import { AppFeatureFlags, DefaultPostHogFeatureFlags } from 'types/appFeatureFlags';

/**
 * Recoil that contains the cached feature flags instance.
 */
const featureFlagsAtom = atom<AppFeatureFlags>({
  key: 'featureFlagsAppState',
  default: convertPostHogFeatureFlags(DefaultPostHogFeatureFlags),
});

/**
 * Hook to manipulate the cached feature flags.
 */
export const useCachedFeatureFlags = () => useRecoilState(featureFlagsAtom);

/**
 * Hook that provides a function to update the cached feature flags.
 */
export const useSetCachedFeatureFlags = () => useSetRecoilState(featureFlagsAtom);
