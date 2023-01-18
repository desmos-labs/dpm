import LottieView from 'lottie-react-native';
import React, { useMemo } from 'react';
import { useTheme } from 'react-native-paper';
import { DPMAnimations } from 'types/images';
import {
  broadcastTxDarkAnimation,
  broadcastTxLightAnimation,
  connectToLedgerDarkAnimation,
  connectToLedgerLightAnimation,
  loadingDarkAnimation,
  loadingLightAnimation,
  lookingForDevicesDarkAnimation,
  lookingForDevicesLightAnimation,
} from 'assets/animations';

type ThemedLottieViewProps = Omit<React.ComponentProps<typeof LottieView>, 'source'> & {
  source: DPMAnimations;
};

const ThemedLottieView: React.FC<ThemedLottieViewProps> = (props) => {
  const { source } = props;
  const theme = useTheme();
  const animation = useMemo(() => {
    switch (source) {
      case DPMAnimations.BroadcastTx:
        return theme.dark ? broadcastTxDarkAnimation : broadcastTxLightAnimation;
      case DPMAnimations.LookingForDevices:
        return theme.dark ? lookingForDevicesDarkAnimation : lookingForDevicesLightAnimation;
      case DPMAnimations.ConnectToLedger:
        return theme.dark ? connectToLedgerDarkAnimation : connectToLedgerLightAnimation;
      case DPMAnimations.Loading:
        return theme.dark ? loadingDarkAnimation : loadingLightAnimation;
      default:
        throw new Error(`Invalid DPM animation value: ${source}`);
    }
  }, [theme, source]);

  return <LottieView {...props} source={animation} />;
};

export default ThemedLottieView;
