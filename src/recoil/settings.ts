import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, useRecoilState, useRecoilValue } from 'recoil';
import { AppSettings } from 'types/settings';
import { findChainByName } from 'lib/ChainsUtils';
import { DesmosMainnet, DesmosTestnet } from '@desmoslabs/desmjs';

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
  return findChainByName(settings.chainName);
};

export const useSettingsState = () => useRecoilState(appSettingsState);

export const useSettings = () => useRecoilValue(appSettingsState);

export default appSettingsState;
