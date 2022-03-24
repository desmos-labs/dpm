import LottieView from 'lottie-react-native';
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';

export type DesmosAnimations = 'broadcast-tx' | 'looking-for-devices' | 'connect-to-ledger';

type Props = Omit<React.ComponentProps<typeof LottieView>, 'source'> & {
  source: DesmosAnimations;
};

export const ThemedLottieView: React.FC<Props> = (props) => {
  const theme = useTheme();
  const animation = useMemo(() => {
    switch (props.source) {
      case 'broadcast-tx':
        return theme.dark
          ? require('../assets/animations/broadcast-tx-dark.json')
          : require('../assets/animations/broadcast-tx-light.json');
      case 'looking-for-devices':
        return theme.dark
          ? require('../assets/animations/looking-for-devices-dark.json')
          : require('../assets/animations/looking-for-devices-light.json');
      case 'connect-to-ledger':
        return theme.dark
          ? require('../assets/animations/connect-to-ledger-dark.json')
          : require('../assets/animations/connect-to-ledger-light.json');
      default:
        throw new Error(`Unknown animation ${props.source}`);
    }
  }, [theme, props.source]);

  return <LottieView {...props} source={animation} />;
};
