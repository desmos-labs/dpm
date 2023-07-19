import React from 'react';
import { Linking } from 'react-native';

const useShowToS = () =>
  React.useCallback(() => {
    Linking.openURL('https://desmos.network/dpm/terms');
  }, []);

export default useShowToS;
