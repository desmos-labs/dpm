import React from 'react';
import { Linking } from 'react-native';

const useShowPrivacyPolicy = () =>
  React.useCallback(() => {
    Linking.openURL('https://desmos.network/dpm/privacy');
  }, []);

export default useShowPrivacyPolicy;
