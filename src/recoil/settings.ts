import React, { useMemo } from 'react';
import { getMMKV, MMKVKEYS, setMMKV } from 'lib/MMKVStorage';
import { atom, selectorFamily, useRecoilValue, useSetRecoilState } from 'recoil';
import { AppSettings } from 'types/settings';
import { findChainInfoByName } from 'lib/ChainsUtils';
import { DesmosMainnet, DesmosTestnet, GasPrice } from '@desmoslabs/desmjs';
import { ChainType } from 'types/chains';

/**
 * Default application settings
 */
export const DefaultAppSettings: AppSettings = {
  theme: 'light',
  chainName: __DEV__ ? DesmosTestnet.chainName : DesmosMainnet.chainName,
  balanceHidden: false,
  loginWithBiometrics: false,
  unlockWalletWithBiometrics: false,
  notifications: false,
  dataInitialized: false,
  currentTimezone: '',
  analyticsEnabled: true,
  hideBalance: false,
};

/**
 * Recoil atom for the application settings
 */
const settingsAppState = atom<AppSettings>({
  key: 'appSettings',
  default: (() => {
    const savedSettings = getMMKV<AppSettings>(MMKVKEYS.APP_SETTINGS);
    return savedSettings
      ? {
          // Extend the default settings object so that if we add a new key
          // this will take the value from the default settings.
          ...DefaultAppSettings,
          ...savedSettings,
        }
      : DefaultAppSettings;
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

/**
 * Hook that provides the current {@link ChainType}.
 */
export const useCurrentChainType = () => {
  const chainName = useSetting('chainName');

  return React.useMemo(
    () => (chainName === DesmosMainnet.chainName ? ChainType.Mainnet : ChainType.Testnet),
    [chainName],
  );
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

export const useSettings = () => useRecoilValue(settingsAppState);

/**
 * Recoil that allows to select a single setting value.
 */
const settingState = selectorFamily({
  key: 'setting',
  get:
    (key: keyof AppSettings) =>
    ({ get }) => {
      const settings = get(settingsAppState);
      return settings[key];
    },
});

/**
 * Hook that allows to observe only a single setting value.
 * @param settingKey - Key associated to the setting that needs to be retrieved.
 * @return The value of the setting associated with the given key.
 */
export const useSetting = <K extends keyof AppSettings>(settingKey: K) =>
  useRecoilValue(settingState(settingKey)) as AppSettings[K];

/**
 * Hook that provides a function to update the value of a setting.
 * @param settingKey - Key of the setting of interest.
 */
export const useSetSetting = <K extends keyof AppSettings>(settingKey: K) => {
  const setSettings = useSetSettings();
  return React.useCallback(
    (valOrUpdater: ((currVal: AppSettings[K]) => AppSettings[K]) | AppSettings[K]) => {
      setSettings((currentValue) => {
        const settings: AppSettings = {
          ...currentValue,
        };

        let newValue: AppSettings[K];
        if (typeof valOrUpdater === 'function') {
          newValue = valOrUpdater(currentValue[settingKey]);
        } else {
          newValue = valOrUpdater;
        }

        settings[settingKey] = newValue;
        return settings;
      });
    },
    [settingKey, setSettings],
  );
};

export const useSetSettings = () => useSetRecoilState(settingsAppState);
