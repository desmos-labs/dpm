import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { AppSettings } from 'types/settings';
import { findChainInfoByName } from 'lib/ChainsUtils';
import { DesmosMainnet, DesmosTestnet, GasPrice } from '@desmoslabs/desmjs';
import { useMemo } from 'react';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  chainName: __DEV__ ? DesmosTestnet.chainName : DesmosMainnet.chainName,
  balanceHidden: false,
  biometrics: false,
  notifications: false,
  dataInitialized: false,
  currentTimezone: '',
};

/**
 * Recoil atom for the application settings
 */
const appSettingsState = atom<AppSettings>({
  key: 'appSettings',
  default: (() => {
    const savedSettings = getMMKV<AppSettings>(MMKVKEYS.APP_SETTINGS);
    return savedSettings || DefaultAppSettings;
  })(),
  effects: [
    ({ onSet }) => {
      onSet((newSettingsValues) => {
        setMMKV(MMKVKEYS.APP_SETTINGS, newSettingsValues);
      });
    },
  ],
});

export const useCurrentChainInfo = () => {
  const settings = useSettings();
  return useMemo(() => findChainInfoByName(settings.chainName)!, [settings.chainName]);
};

export const useCurrentChainGasPrice = () => {
  const currentChainInfo = useCurrentChainInfo();
  return useMemo(() => {
    if (currentChainInfo === undefined) {
      return undefined;
    }
    // We support only Desmos at the moment so 0.1 is fine.
    return GasPrice.fromString(`0.1${currentChainInfo.stakeCurrency.coinMinimalDenom}`);
  }, [currentChainInfo]);
};

export const useSettingsState = () => useRecoilState(appSettingsState);

export const useSettings = () => useRecoilValue(appSettingsState);

export default appSettingsState;
