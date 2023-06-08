import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
// eslint-disable-next-line import/no-unresolved
import { POSTHOG_API_KEY } from '@env';
import useTrackPreviouslyCreatedAccounts from 'hooks/analytics/useTrackPreviouslyCreatedAccounts';
import useTrackAppOpened from 'hooks/analytics/useTrackAppOpened';
import { DefaultPosthogFeatureFlags } from 'types/appFeatureFlags';

export interface Props {
  children: React.ReactNode;
}

/**
 * Component to execute analytics operation on application start.
 */
const InternalPostHogComponent: React.FC<Props> = ({ children }) => {
  useTrackPreviouslyCreatedAccounts();
  useTrackAppOpened();

  return <>{children}</>;
};
const DesmosPostHogProvider: React.FC<Props> = ({ children }) => (
  <PostHogProvider
    apiKey={POSTHOG_API_KEY}
    options={{
      host: 'https://app.posthog.com',
      bootstrap: {
        featureFlags: DefaultPosthogFeatureFlags,
      },
    }}
    debug={__DEV__}
    autocapture={{
      captureLifecycleEvents: false,
      captureTouches: false,
      captureScreens: false,
    }}
  >
    <InternalPostHogComponent children={children} />
  </PostHogProvider>
);

export default DesmosPostHogProvider;
