import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

/**
 * Component that will be rendered exclusively on iOS to
 * initialize the application in the background and manage notifications.
 */
const AppSilent = () => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return null;
};

export default AppSilent;
