import { useEffect } from 'react';
import RNBootSplash from 'react-native-bootsplash';

const AppSilent = () => {
  useEffect(() => {
    RNBootSplash.hide();
  }, []);

  return null;
};

export default AppSilent;
