import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
import { useSetting } from '@recoil/settings';
import { POSTHOG_API_KEY } from '@env';

export interface Props {
  children: React.ReactNode;
}

const DesmosPostHogProvider: React.FC<Props> = ({ children }) => {
  const analyticsEnabled = useSetting('analyticsEnabled');

  return (
    <PostHogProvider
      children={children}
      apiKey={POSTHOG_API_KEY}
      options={{
        host: 'https://app.posthog.com',
        enable: analyticsEnabled,
      }}
      autocapture={{
        captureLifecycleEvents: false,
        captureTouches: true,
      }}
    />
  );
};

export default DesmosPostHogProvider;
