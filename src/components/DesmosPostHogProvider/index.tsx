import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
import { useSetting } from '@recoil/settings';
// eslint-disable-next-line import/no-unresolved
import { POSTHOG_API_KEY } from '@env';
import useTrackPreviouslyCreatedAccounts from 'hooks/analytics/useTrackPreviouslyCreatedAccounts';

export interface Props {
  children: React.ReactNode;
}

/**
 * Component to execute analytics operation on application start.
 */
const InternalPostHogComponent: React.FC<Props> = ({ children }) => {
  useTrackPreviouslyCreatedAccounts();

  return <>{children}</>;
};
const DesmosPostHogProvider: React.FC<Props> = ({ children }) => {
  const analyticsEnabled = useSetting('analyticsEnabled');

  return (
    <PostHogProvider
      apiKey={POSTHOG_API_KEY}
      options={{
        host: 'https://app.posthog.com',
        enable: analyticsEnabled,
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
};

export default DesmosPostHogProvider;
